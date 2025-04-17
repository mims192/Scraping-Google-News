import puppeteer from 'puppeteer';
import StockNews from './Models/StockNewsSchema.js'

export async function scrapeNews(stock) {
  const query = encodeURIComponent(`${stock} NSE stock`);
  const url = `https://www.google.com/search?q=${query}&tbm=nws`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']

  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9',
  });
  const allArticles = [];

  try {
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    let lastPageReached = false;
    let pageCounter = 1;
    while (!lastPageReached && pageCounter <= 2) {
     const articles = await page.evaluate((stockSymbol) => {
      const results = [];
     
     
      document.querySelectorAll('div.SoaBEf').forEach((newsItem) => {
       
        const linkElement = newsItem.querySelector('a.WlydOe');
        const link = linkElement?.href || '';
        
        const title = newsItem.querySelector('div.n0jPhd.ynAwRc.MBeuO.nDgy9d[role="heading"]')?.innerText || '';
        const summary = newsItem.querySelector('div.GI74Re.nDgy9d')?.innerText || '';
        
    
        const publisherDiv = newsItem.querySelector('div.MgUUmf.NUnG9d');
        const publisher = publisherDiv?.innerText || '';
        
        const date = newsItem.querySelector('div.OSrXXb.rbYSKb.LfVVr span')?.innerText || '';
        
        results.push({ stock: stockSymbol,title, link, summary, publisher, date });
      });
      
      return results;
    },stock);

    allArticles.push(...articles);
    
    if (pageCounter === 2) {
    console.log('Reached page 2. Stopping.');
    break;
    }

    const nextPageLink = await page.$('a#pnnext');

    if (!nextPageLink) {
      console.log('No more pages. Exiting.');
      lastPageReached = true;
    } else {
      console.log('Navigating to next page...');
      await nextPageLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
      console.log(`Current URL: ${page.url()}`);
      pageCounter++;
    }
  }

  console.log(`Total articles scraped: ${allArticles.length}`);
  return allArticles;
  } catch (error) {
    console.error('Error during scraping:', error);
    return [];
  } finally {
    await browser.close();
  }
}

export async function saveNews(articles) {
  if (articles.length === 0) {
    console.log('No news found');
    return;
  }
  


  for (const article of articles) {
    try {
      const newArticle = new StockNews({
        stock: article.stock,
        title: article.title,
        summary: article.summary,
        publisher: article.publisher,
        date: article.date,
        link: article.link,
      });

      await newArticle.save();
      
    } catch (error) {
      if (error.code !== 11000) {
        console.error(`Error saving article "${article.title}":`, error.message);
      } 
    }
  }
}
