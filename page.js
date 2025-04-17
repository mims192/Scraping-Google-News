import fs from 'fs';
import puppeteer from 'puppeteer';

export async function scrapeNew(stock) {
  const query = encodeURIComponent(stock);
  const url = `https://www.google.com/search?q=${query}&tbm=nws`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // TEMP: log page HTML
  const html = await page.content();

  // Write the page content (HTML) to 'page.html'
  fs.writeFileSync('page.html', html);

  console.log("HTML content saved to page.html");

  await browser.close();
}
