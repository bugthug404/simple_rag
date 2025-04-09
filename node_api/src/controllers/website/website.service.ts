import { Request, Response } from "express";

import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Ollama } from "@langchain/community/llms/ollama";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "langchain/prompts";
import { pull } from "langchain/hub";
import { extractWebsiteUrl } from "./utils/extract-website-urls";
import { PlaywrightCrawler } from "crawlee";

export async function getWebsiteUrls(req: Request, res: Response) {
  try {
    const webUrl = req.body.url;

    if (!webUrl) {
      return res.status(400).json({
        message: "url is required",
      });
    }

    const urls: string[] = [];
    const crawler = new PlaywrightCrawler({
      async requestHandler({ request, enqueueLinks }) {
        if (request.loadedUrl.endsWith(".webp")) return;
        console.log(request.loadedUrl);
        urls.push(request.loadedUrl);

        await enqueueLinks({});
      },
      maxConcurrency: 10,
    });

    await crawler.run([webUrl]);

    // return urls;
    console.log(urls, urls.length);

    return res.send({ urls }).status(200);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message ?? "Internal server error" });
  }
}

export async function addWebsite(req: Request, res: Response) {
  try {
    const webUrl = req.body.url;

    if (!webUrl) {
      return res.status(400).json({
        message: "url is required",
      });
    }

    let domain: string;

    try {
      domain = new URL(webUrl).hostname;
    } catch (error) {
      domain = new URL("http://" + webUrl).hostname;
    }

    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(webUrl)) {
      return res.status(400).json({ message: "invalid url format" });
    }

    // const domain = new URL(webUrl).hostname;

    const client = new QdrantClient({
      url: "http://localhost:6333",
      port: 6333,
    });

    try {
      const searchResult = await client.getCollection(domain);
      console.log(searchResult);
      return res.status(400).json({
        message: "this domain already added. try recreate to add again.",
      });
    } catch (err) {
      // nothing to do here
    }

    await extractWebsiteUrl(webUrl, domain);

    return res.json({ status: "data uploaded successfully" }).status(200);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function askWebsite(req: Request, res: Response) {
  try {
    const { query, model = "gemma:2b" } = req.query;
    const domain = req.body?.domain;

    let collectionName: string;

    try {
      collectionName = new URL(domain).hostname;
    } catch (error) {
      collectionName = new URL("http://" + domain).hostname;
    }

    console.log("---", query, model, collectionName);

    if (!query || !model || !collectionName) {
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
        collectionName: collectionName,
      }
    );

    const retriever = vectorStore.asRetriever(5);

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
