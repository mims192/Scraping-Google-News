import express from 'express';
import {scrapeNews,saveNews} from './crawler.js';
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

const stocks = [
  'MANAKSIA STEELS',
  'TATA STEEL',
  'ABB INDIA',
  '3M INDIA',
  'TATA MOTORS',
  'NIACL',
  'HUDCO',
  'SJVN',
  'ITI',
  'TERA SOFTWARE'
];

const runScraper = async () => {
  for (const stock of stocks) {
    console.log(`Scraping ${stock}...`);
    try {
      const articles = await scrapeNews(stock);
      await saveNews(articles);
    } catch (err) {
      console.error(`Error scraping ${stock}:`, err.message);
    }
  }
  console.log(" All stocks scraped and saved.");
  process.exit(0);
};


mongoose.connect(process.env.URI,{})
.then(()=>{
  console.log("Connected to Mongodb");
  runScraper();
})
.catch((err)=>{
  console.error("Error connecting to MongoDB",err.message);
  
});

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, backend is working!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
