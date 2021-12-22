import express from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import { config } from './config/config.js';
import { userRoute } from './routes/userRoute.js';
import passport from 'passport';
import { bookRoute } from './routes/bookRoute.js';
import { errorHandler } from './middlewares/error-handler.js';
import helmet from 'helmet';
const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());
app.use(passport.initialize());

// Routes
app.use('/api/v1', userRoute);
app.use('/api/v1', bookRoute);

app.get('/', (req, res) => {
  res.send('Hello');
});

app.use(errorHandler);
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    app.listen(config.PORT, () => {
      console.log('Listening to port ' + config.PORT);
    });
  })
  .catch((err) => console.log(err));
