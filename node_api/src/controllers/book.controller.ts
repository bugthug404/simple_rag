import { Router } from "express";
import { addBook, askBook } from "./book.service";

const bookRouter = Router();

bookRouter.post("/add-book", addBook);
bookRouter.get("/ask-book", askBook);

export default bookRouter;
