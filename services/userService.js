import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import bcrypt, { genSalt } from 'bcrypt';
import { generateToken, signNewAccessToken } from '../common/jwt.js';
import { config } from '../config/config.js';
class UserService {
  getUploadedBook = async (user) => {
    const uploadedBooks = await Book.find({ uploader: user._id }).lean().select('title isbn13 price image url _id');

    return uploadedBooks;
  };

  createUser = async (user) => {
    const newUser = await User.create(user);

    return newUser;
  };

  signup = async (data) => {
    const SALT_ROUNDS = 10;

    const { email, password, userName } = data;

    const existUser = await User.findOne({ email });

    let existLocalIdendity;
    if (existUser) {
      existLocalIdendity = existUser.identities.find((identity) => identity.provider_type === 'local');
    }

    if (existLocalIdendity) throw new Error('Email already has been used');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      email,
      identities: {
        provider_type: 'local',
        data: {
          email,
          password: hashedPassword,
          userName,
        },
      },
    };
    // if user already exist , add new identity else create a new user
    if (existUser) {
      await this.addAuthProvider(newUser.email, newUser.identities);
    } else {
      await this.createUser(newUser);
    }
  };

  login = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email }).lean();

    if (!user) throw new Error('User does not exist');

    const identityData = user.identities.find((identity) => identity.provider_type === 'local');

    if (!identityData) throw new Error('Email has not been sign up or already been use');

    // compare password
    const isMatched = await bcrypt.compare(password, identityData.data.password);

    if (!isMatched) throw new Error('Wrong password');

    const payload = { userId: user._id, email: identityData.email, userName: identityData.userName };

    const [jwtToken, refreshToken] = await Promise.all([generateToken(payload, config.JWT_SECRET, config.ACCESS_TOKEN_EXPIRES), generateToken(payload, config.REFRESH_TOKEN_SECRET, config.REFRESH_TOEKN_EXPIRES)]);

    return { access_token: jwtToken, refresh_token: refreshToken };
  };

  refreshAccessToken = async (refreshToken) => {
    const newAccessToken = await signNewAccessToken(refreshToken);

    return newAccessToken;
  };

  addAuthProvider = async (email, identity) => {
    await User.findOneAndUpdate({ email: email }, { $push: { identities: identity } });
  };
}

export const userService = new UserService();
