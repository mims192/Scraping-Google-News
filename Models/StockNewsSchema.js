import mongoose from "mongoose";

const StockNewsSchema=new mongoose.Schema({
    stock: {
        type: String,
        required: true,
        trim: true,
        index: true 
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      publisher: {
        type: String,
        default: 'Unknown',
        trim: true
      },
      summary:{
        type: String,
        trim: true
      },
      date: {
        type: String,
        default: 'Unknown'
      },
      link: {
        type: String,
        unique: true, //to avoid duplicates
        trim: true
      }
     
})

const StockNews = mongoose.model('StockNews', StockNewsSchema);
export default StockNews;
