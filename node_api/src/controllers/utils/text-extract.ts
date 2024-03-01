import { PDFExtractResult } from "pdf.js-extract";

export function extractFullText(
  textData: PDFExtractResult,
  skipFrontPages = 0,
  skipEndPages = 0
) {
  const pages = textData.pages;
  const skipStart = skipFrontPages > 0 ? pages.slice(skipFrontPages) : pages;
  const skipEnd =
    skipEndPages > 0 ? skipStart.slice(0, -skipEndPages) : skipStart;

  const fullText = skipEnd
    .map((page) => page.content.map((element) => element.str).join(" "))
    .join(" ");

  return fullText;
}
