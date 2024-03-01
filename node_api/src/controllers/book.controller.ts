import { Router } from "express";
import { addBook, deleteGroceryItem, updateGroceryItem } from "./book.service";

const bookRouter = Router();

bookRouter.post("/add-book", addBook);
bookRouter.put("/edit/:id", updateGroceryItem);
bookRouter.delete("/delete/:id", deleteGroceryItem);

export default bookRouter;
