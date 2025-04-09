import { Router } from "express";
import { askWebsite, addWebsite, getWebsiteUrls } from "./website.service";

const websiteRouter = Router();

websiteRouter.post("/add", addWebsite);
websiteRouter.post("/ask", askWebsite);
websiteRouter.post("/urls", getWebsiteUrls);

export default websiteRouter;
