import { Request, Response } from "express";
import { Types } from "mongoose";
import { GroceryItem } from "../model/grocery-item";
import { groceryItemSchema } from "../utils/joi-edit-user-schema";

import { Buffer } from "buffer"; // Import Buffer class
import fs from "fs";
import tempfile from "tempfile";
import { PDFExtract } from "pdf.js-extract";
import tempFile from "temp-file";
import temp from "temp";
import { splitWithOverlap } from "./utils/text-splitter";
import { getEmbeddings } from "./utils/get-embeddings";
import { QdrantClient } from "@qdrant/js-client-rest";
import { addPointsToCollection } from "./utils/put-collection";
import { PointVetorType } from "./utils/types";
import { extractFullText } from "./utils/text-extract";

export async function addBook(req: Request, res: Response) {
  try {
    // Get PDF data from body
    const { data: dataUri } = req.body as any;
    const base64Data = dataUri.split(",")[1];
    const pdfData = Buffer.from(base64Data, "base64");

    const tempFilePath = "temp.pdf";

    await fs.promises.writeFile(tempFilePath, pdfData);

    const pdfExtract = new PDFExtract();
    const textData = await pdfExtract.extract(tempFilePath);
    // const fullText = textData.pages
    //   .map((v) => v.content.map((e) => e.str).join(" "))
    //   .join(" ");
    const fullText = extractFullText(textData, 5);

    const texts = splitWithOverlap(fullText, 1000, 100);

    let embeddings: PointVetorType[] = [];

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      const embed = await getEmbeddings(text);

      embeddings.push({
        id: i,
        vector: embed.embedding,
        payload: { chunk: text },
      });
    }

    const data = await addPointsToCollection("my_book", embeddings);

    res.json({ status: "data uploaded successfully" }).status(200);
  } catch (error: any) {
    console.error(error);
    res.json({ error: error.message ?? "Internal server error" }).status(500);
  }
}

export async function askBook(req: Request, res: Response) {
  const { query, model = "gemma:2b" } = req.query;
  console.log("---", query, model);

  if (!query || !model) {
    res
      .json({ error: "Missing required parameters for this request." })
      .status(400);
    return;
  }

  const embed: {
    embedding: number[];
  } = await getEmbeddings(query as string);

  console.log(embed.embedding);

  const client = new QdrantClient({
    url: "http://localhost",
    port: 6333,
  });

  const answer = await client.search("my_book", {
    vector: embed.embedding,
    limit: 10,
  });

  console.log(answer);
  //  TODO: provide these results to llm to organise & generate response for the user
}
