import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { nanoid } from 'nanoid';
import { User } from '../models/User.js';

export const generateToken = (payload, secret, expiredTime) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: expiredTime }, (err, encoded) => {
      if (err) reject(err);

      resolve(encoded);
    });
  });
};

export const verifyAccessToken = () => {};

export const signNewAccessToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, {}, async (err, payload) => {
      if (err) reject(err);

      const isValidUser = await User.exists({ _id: payload.userId });

      if (!isValidUser) reject(new Error('Invalid User'));

      const newAccessToken = await generateJwtToken(payload);

      resolve(newAccessToken);
    });
  });
};
