import express from 'express';
import passport from 'passport';
import { bookController } from '../controllers/bookController.js';

export const bookRoute = express.Router();

bookRoute.get('/library', bookController.getBooks);
bookRoute.get('/library/:id', bookController.getBookById);
bookRoute.post('/library/upload', passport.authenticate(['google-token'], { session: false }), bookController.uploadBook);
