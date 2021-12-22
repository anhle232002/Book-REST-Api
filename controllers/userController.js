import asyncHandler from 'express-async-handler';
import { bookService } from '../services/bookService.js';
import { userService } from '../services/userService.js';

class UserController {
  signup = asyncHandler(async (req, res) => {
    await userService.signup(req.body);

    return res.status(200).json({ result: true, message: 'Signup sucessfully' });
  });

  login = asyncHandler(async (req, res) => {
    const tokens = await userService.login(req.body);

    res.setHeader('access_token', tokens.access_token);

    res.setHeader('refresh_token', tokens.refresh_token);

    return res.status(200).json({ result: true, message: 'Login successfully' });
  });

  refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.params.refresh_token || req.header('refresh-token');

    const newAccessToken = await userService.refreshAccessToken(refreshToken);

    res.setHeader('access_token', newAccessToken);

    return res.status(200).json({ result: true, message: 'New access token has been created' });
  });

  googleLogin = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user.isUser) {
      console.log('not user');
      const newUser = await userService.createUser(user.userInfo);
    } else if (user.isUser && !user.hasGoogleAuth) {
      console.log('is user');
      await userService.addAuthProvider(user.userInfo.email, user.userInfo.identities);
    }

    res.status(200).json({ result: true, message: 'Login successfully' });
  });

  getUploadedBooks = asyncHandler(async (req, res) => {
    const user = req.user;

    const books = await userService.getUploadedBook(user);

    return res.status(200).json({ error: 0, books, count: books.length });
  });

  deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await bookService.deleteBook(id, req.user);

    res.status(200).json({ error: 0, result: 'OK', message: 'Delete successfully' });
  });

  uploadPdf = asyncHandler(async (req, res) => {
    //
  });
}
export const userController = new UserController();
