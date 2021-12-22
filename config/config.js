import dotenv from 'dotenv';
dotenv.config();

export const config = {
  MONGO_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 5000,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES: '1m',
  REFRESH_TOEKN_EXPIRES: '1d',
};
