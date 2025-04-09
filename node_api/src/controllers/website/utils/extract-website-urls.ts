import { PlaywrightCrawler } from "crawlee";
import { saveUrlData } from "./save-url-data";

export async function extractWebsiteUrl(url: string, domain: string) {
  try {
    const crawler = new PlaywrightCrawler({
      async requestHandler({ request, page, enqueueLinks }) {
        if (request.loadedUrl.endsWith(".webp")) return;
        const pageText = await page.textContent("body");
        const title = await page.title();
        await saveUrlData(url, domain, pageText, title);

        await enqueueLinks({});
        await page.close();
      },
      maxConcurrency: 10,
    });

    await crawler.run([url]);
  } catch (error) {
    console.log("extract == ", error);
    throw new Error(error);
  }
}
