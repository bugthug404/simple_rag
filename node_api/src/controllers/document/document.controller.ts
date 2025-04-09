import { Router } from "express";
import { askDocument, addDocument } from "./document.service";

const documentRouter = Router();

documentRouter.post("/add", addDocument);
documentRouter.get("/ask", askDocument);

export default documentRouter;
