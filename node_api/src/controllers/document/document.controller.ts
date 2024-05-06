import { Router } from "express";
import { askDocument, addDocument } from "./document.service";

const documentRouter = Router();

documentRouter.post("/add-Document", addDocument);
documentRouter.get("/ask-Document", askDocument);

export default documentRouter;
