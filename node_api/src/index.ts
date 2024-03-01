import express from "express";
import Cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { connectToMongoDB } from "./utils/db";
import bookRouter from "./controllers/book.controller";

dotenv.config();
mongoose.set("strictQuery", false);
const app = express();
const port = process.env.PORT || 3009;
app.use(
  Cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
// add json middleware
app.use(express.json({ limit: "20mb" }));
connectToMongoDB();

app.get("/", (req, res) =>
  res.status(200).send({
    data: `server says : get request on time : ${new Date().toLocaleTimeString()}`,
  })
);

app.use("/rag", bookRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
