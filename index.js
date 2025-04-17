import express from 'express';
import {scrapeNews,saveNews} from './crawler.js';
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
mongoose.connect(process.env.URI,{})
.then(()=>{
  console.log("Connected to Mongodb");
})
.catch((err)=>{
  console.error("Error connecting to MongoDB",err.message);
});

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, backend is working!');
});

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
for (const stock of stocks) {
  scrapeNews(stock).then(saveNews);
}





app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
