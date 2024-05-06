import { Request, Response } from "express";

import { Buffer } from "buffer"; // Import Buffer class
import fs from "fs";
import { PDFExtract } from "pdf.js-extract";
import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
// import { QdrantVectorStore } from 'langchain/vectorstores/qdrant';
// import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Ollama } from "@langchain/community/llms/ollama";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "langchain/prompts";
import { pull } from "langchain/hub";

export async function addDocument(req: Request, res: Response) {
  try {
    // Get PDF data from body
    const { data: dataUri } = req.body as any;
    const base64Data = dataUri.split(",")[1];
    const pdfData = Buffer.from(base64Data, "base64");

    const tempFilePath = "temp.pdf";

    await fs.promises.writeFile(tempFilePath, pdfData);

    const pdfExtract = new PDFExtract();
    const textData = await pdfExtract.extract(tempFilePath);
    const fullText = textData.pages
      .map((v) => v.content.map((e) => e.str).join(" "))
      .join(" ");

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.createDocuments([fullText]);

    const embedder = new OllamaEmbeddings({
      model: "llama2", // default value
      baseUrl: "http://localhost:11434", // default value
    });

    await QdrantVectorStore.fromDocuments(docs, embedder, {
      collectionName: "simple_rag",
      client: new QdrantClient({
        url: "http://localhost:6333",
        port: 6333,
      }),
    });
   
    res.json({ status: "data uploaded successfully" }).status(200);
  } catch (error: any) {
    console.error(error);
    res.json({ error: error.message ?? "Internal server error" }).status(500);
  }
}

export async function askDocument(req: Request, res: Response) {
  try {
    const { query, model = "gemma:2b" } = req.query;
    console.log("---", query, model);

    if (!query || !model) {
      res
        .json({ error: "Missing required parameters for this request." })
        .status(400);
      return;
    }

    const embeddings = new OllamaEmbeddings({
      model: "nomic-embed-text", // default value
      baseUrl: "http://localhost:11434", // default value
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "simple_rag",
      }
    );

    // const searchResult = await vectorStore.similaritySearch(query as string);

    const retriever = vectorStore.asRetriever(3);
    // const documentEmbeddings = await embeddings.embedDocuments([
    //   query as string,
    // ]);

    const llm = new Ollama({
      baseUrl: "http://localhost:11434",
      model: "llama2",
    });

    const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt: prompt,
    });

    const retrivedDocs = await retriever.getRelevantDocuments(query as string);

    const hh = await ragChain.invoke({
      question: query,
      context: retrivedDocs,
    });
    console.log("this is result ", hh);
    res.send(hh);
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message ?? "Internal server error" });
  }
}
