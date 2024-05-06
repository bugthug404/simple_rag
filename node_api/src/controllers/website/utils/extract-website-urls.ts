import { PlaywrightCrawler } from "crawlee";
import { saveUrlData } from "./save-url-data";

export async function extractWebsiteUrl(url: string, domain: string) {
  const urls: { url: string; title?: string }[] = [];
  const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, enqueueLinks, log }) {
      if (request.loadedUrl.endsWith(".webp")) return;
      const pageText = await page.textContent("body")
      const title = await page.title();
      await saveUrlData(url, domain, pageText, title);

      await enqueueLinks({});
      await page.close();
    },
    maxConcurrency: 10,
  });

  await crawler.run([url]);
return 
}
