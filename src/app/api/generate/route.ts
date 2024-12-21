import { renderTemplate } from "@/lib/utils";
import { PayStubType } from "@/types";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  let browser;
  const body: PayStubType = await req.json();
  try {
    const ReactDOMServer = (await import("react-dom/server")).default;

    const Template = await renderTemplate();
    if(!Template) {
      return;
    }

    const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
      Template(body)
    )
    const puppeteer = await import("puppeteer");
            browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                headless: true,
            });

    if(!browser) {
      throw new Error("Failed to launch browser")
    }
  
    const page = await browser.newPage();
    console.log("Page opened"); // Debugging log
  
    await page.setContent(await htmlTemplate, {
      // * "waitUntil" prop makes fonts work in templates
      waitUntil: "networkidle0",
          });
    await page.addStyleTag({
      url: "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    })
    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
  });
  for (const page of await browser.pages()) {
    await page.close();
  }

  // Close the Puppeteer browser
  await browser.close();
  console.log("Browser closed"); // Debugging log

  // Create a Blob from the PDF data
  const pdfBlob = new Blob([pdf], { type: "application/pdf" });

  const response = new NextResponse(pdfBlob, {
      headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=invoice.pdf",
      },
      status: 200,
  });

  return response;
  } catch (error) {
    console.log(error)
  }

}