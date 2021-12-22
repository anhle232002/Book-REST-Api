import asyncHandler from 'express-async-handler';
import { Book } from '../models/Book.js';
import { bookService } from '../services/bookService.js';

class BookController {
  getBooks = asyncHandler(async (req, res, next) => {
    const query = req.query;

    const result = await bookService.getBooks(query);

    res.status(200).json({ error: 0, ...result });
  });

  getBookById = asyncHandler(async (req, res, next) => {
    const bookId = req.params.id;

    const result = await bookService.getBookById(bookId);

    res.status(200).json({ error: 0, result });
  });

  uploadBook = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user.isUser) throw new Error('Require login');

    await bookService.uploadBook(req.body, user.userInfo);

    res.status(200).json({ error: 0, result: 'OK', message: 'Upload successfully' });
  });
}

export const bookController = new BookController();
