import { Book } from '../models/Book.js';

class BookService {
  uploadBook = async (doc, user) => {
    const { title, authors, publisher, isbn10, isbn13, pages, year, ratings, desc, price, image, url } = doc;

    const uploader = user._id;
    // Check exist book
    const book = await Book.findOne({ isbn10, isbn13 });

    if (book) {
      console.log(book);
      throw Error('Book already existed');
    }

    const newBook = await Book.create({ ...doc, uploader });

    console.log(newBook);
  };
  getBookById = async (bookId) => {
    return await Book.findById(bookId);
  };

  getBooks = async ({ title, page = 1, category }) => {
    const BOOK_PER_PAGE = 5;

    const queryObject = {};

    if (title) {
      queryObject.title = {
        $regex: title,
        $options: 'i',
      };
    }

    // Select all document that matched all value in category array
    if (category) {
      category = category.split(',');

      queryObject.category = {
        $all: category,
      };
    }

    const books = await this.paginate(+page, queryObject, BOOK_PER_PAGE);

    return {
      books,
      count: books.length,
      page: page,
    };
  };

  // Using range queries
  // documents are sorted by _id in ascending
  paginate = async (page, queryObject, nPerpage) => {
    // Get page 1
    let books = await Book.find(queryObject).sort({ _id: 1 }).lean().limit(nPerpage).select('title isbn13 price image url _id');

    if (page === 1) return books;

    if (books.length === 0) return books;

    // get _id of the last record to get next page
    let startValue = books[books.length - 1]._id;

    queryObject._id = {
      $gt: startValue,
    };

    let currentPage = 1;

    while (currentPage < page) {
      books = await Book.find(queryObject).sort({ _id: 1 }).lean().limit(nPerpage).select('title isbn13 price image url _id');

      if (books.length === 0) return [];

      // update _id of the last record to get next page
      queryObject._id.$gt = books[books.length - 1]._id;

      currentPage++;
    }

    return books;
  };

  deleteBook = async (bookId, user) => {
    const book = await Book.findById(bookId);

    if (!book) throw new Error('Book does not exist');

    if (user._id.toString() !== book.uploader) throw new Error('UNAUTHORIED');

    await Book.findByIdAndDelete(book._id);
  };
}

export const bookService = new BookService();
