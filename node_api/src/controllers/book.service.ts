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

export async function addBook(req: Request, res: Response) {
  try {
    // Get PDF data from body
    // const { data: dataUri } = req.body as any;
    // const base64Data = dataUri.split(",")[1];
    // console.log("base64Data === ", base64Data);
    // const pdfData = Buffer.from(base64Data, "base64");

    // console.log("pdfdata ==== ", pdfData);

    // const tempFilePath = "temp.pdf";

    // await fs.promises.writeFile(tempFilePath, pdfData);

    // const pdfExtract = new PDFExtract();
    // const textData = await pdfExtract.extract(tempFilePath);
    // const fullText = textData.pages
    //   .map((v) => v.content.map((e) => e.str).join(" "))
    //   .join(" ");

    // const texts = splitWithOverlap(fullText, 1000, 100);

    // const client = new QdrantClient({ url: "http://127.0.0.1:6333" });

    // client.recreateCollection("node_rag", {});

    let embeddings: string[] = [];

    // for (let text in texts) {
    //   const embed = await getEmbeddings(text);
    //   embeddings.push(embed);
    // }

    // console.log("embedding === ", embeddings);

    const data = await addPointsToCollection("ayye");

    // console.log("==== ", data);

    res.json({ status: "data uploaded successfully" }).status(200);
  } catch (error: any) {
    console.error(error);
    res.json({ error: error.message ?? "Internal server error" }).status(500);
  }
}

export async function createGroceryItem(req: Request, res: Response) {
  const item = req.body;
  const userid = req.body.decodedToken.userId;
  console.log("item", item);
  console.log("userid", userid);
  if (!item) {
    return res.status(400).send({ error: "Item is required" });
  }
  try {
    const data = await GroceryItem.create({
      ...item,
      userId: new Types.ObjectId(userid),
    });
    return res
      .status(200)
      .send({ data: data, message: "Item created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
}

export async function updateGroceryItem(req: Request, res: Response) {
  const validData = groceryItemSchema.validate(req.body);
  if (validData.error)
    return res.status(400).send({ error: validData.error.details[0].message });

  console.log("updateGroceryItem called");
  const item = req.body;
  const userid = req.body.decodedToken.userId;
  delete item.decodedToken;

  console.log("item", item);
  console.log("userid", userid);

  if (!item) {
    res.status(400).send({ error: "Item is required" });
    return;
  }
  try {
    const data = await GroceryItem.updateOne(
      { _id: new Types.ObjectId(item._id) },
      { $set: { ...item } }
    );
    console.log("data ==== ", data);
    return res
      .status(200)
      .send({ data: data, message: "Item updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
}

export async function deleteGroceryItem(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).send({ error: "Item id is required" });
    return;
  }
  try {
    const data = await GroceryItem.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return res
      .status(200)
      .send({ data: data, message: "Item deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
}
