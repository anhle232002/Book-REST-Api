import passport from 'passport';
import { config } from '../config/config.js';
import { User } from '../models/User.js';
import passportGoogle from 'passport-google-token';
import passportJwt, { ExtractJwt } from 'passport-jwt';

const GoogleStrategy = passportGoogle.Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);

        const user = await User.findOne({
          email: profile._json.email,
        });

        // User already exist with google auth
        const hasGoogleIdentity = user?.identities.some((identity) => identity.provider_type === 'google');

        if (user && hasGoogleIdentity) {
          return done(null, user);
        }

        if (!user || (user && !hasGoogleIdentity)) {
          const doc = {
            email: profile._json.email,
            identities: {
              provider_type: profile.provider,
              data: profile._json,
            },
          };
          console.log('hi');
          return done(null, { userInfo: doc, isUser: user, hasGoogleAuth: false });
        }

        if (!hasGoogleIdentity) done(new Error('Require Login'), false);
      } catch (error) {
        console.log(error);

        done(error, false);
      }
    },
  ),
);

const JwtStrategy = passportJwt.Strategy;

const JwtExtractor = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromHeader('access_token'), ExtractJwt.fromBodyField('access_token'), ExtractJwt.fromUrlQueryParameter('access_token')]);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: config.JWT_SECRET,
      jwtFromRequest: JwtExtractor,
    },
    async (payload, done) => {
      try {
        console.log(payload);

        const user = await User.findById(payload.userId).lean();

        if (!user) done(new Error('Invalid token'), false);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);
