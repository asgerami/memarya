import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const pdfUrl =
  "https://tacit-puma-242.convex.cloud/api/storage/939d0a6c-dad3-4dfc-8cd4-147350d26a34";

// Load the PDF
export async function GET(req) {
  const response = await fetch(pdfUrl);
  const data = await response.blob();
  const loader = new WebPDFLoader(data);
  const docs = await loader.load();

  let pdfTextContent = " ";
  docs.forEach((doc) => {
    pdfTextContent = pdfTextContent + doc.pageContent + " ";
  });

  // Split the Text into smaller bits
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100, //Maybe bigger
    chunkOverlap: 20,
  });
  const output = await splitter.createDocuments([pdfTextContent]);

  let splitterList = [];
  output.forEach((docs) => {
    splitterList.push(docs.pageContent);
  });

  return NextResponse.json({ result: splitterList });
}
