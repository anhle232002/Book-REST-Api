import express from 'express';
import passport from 'passport';
import * as config from '../common/passport.js';
import { userController } from '../controllers/userController.js';

export const userRoute = express.Router();

userRoute.post('/user/signup', userController.signup);
userRoute.post('/user/login', userController.login);
userRoute.post('/user/login/google', passport.authenticate('google-token', { session: false }), userController.googleLogin);
userRoute.post('/user/refresh-token', userController.refreshAccessToken);
userRoute.get('/user/library', passport.authenticate(['google-token', 'jwt'], { session: false }), userController.getUploadedBooks);
userRoute.delete('/user/library/delete/:id', passport.authenticate(['google-token', 'jwt'], { session: false }), userController.deleteBook);
