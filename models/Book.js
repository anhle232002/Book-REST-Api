import mongoose from 'mongoose';

const BookSchema = mongoose.Schema({
  title: String,
  authors: String,
  publisher: String,
  category: [],
  isbn10: {
    type: String,
    default: '',
  },
  isbn13: {
    type: String,
    default: '',
  },
  pages: String,
  ratings: Number,
  desc: String,
  price: String,
  image: String,
  url: String,
  uploader: String,
});

export const Book = mongoose.model('Book', BookSchema);
