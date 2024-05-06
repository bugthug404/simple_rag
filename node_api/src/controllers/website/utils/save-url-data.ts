import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import axios from "axios";
// import { JSDOM } from "jsdom/lib/jsdom/living/";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function saveUrlData(
  url: string,
  domain: string,
  pageText: string,
  title?: string,
): Promise<{ success?: boolean; error?: string }> {
  try {

    const textContent = pageText

    const removeEmptyLines = (textContent: string) => {
      const lines = textContent.split("\n");
      const nonEmptyLines = lines.filter((line) => line.trim());
      return nonEmptyLines.join("\n");
    };

    const cleanedTextContent = removeEmptyLines(textContent);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.createDocuments(
      [cleanedTextContent],
      [{ url, title }]
    );

    const embedder = new OllamaEmbeddings({
      model: "nomic-embed-text", 
      baseUrl: "http://localhost:11434", 
    });

    const client = new QdrantClient({
      url: "http://localhost",
      port: 6333
    });

    await QdrantVectorStore.fromDocuments(docs, embedder, {
      collectionName: domain,
      client: client,
    });

    return { success: true };
  } catch (e:any) {
    console.log("error", e);

    return { error: e.message ?? "error" };
  }
}
