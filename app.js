require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const handleError = require('./middlewares/errors');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/limiter');


const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', { family: 4 });
const { createUser, login, signout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(limiter);
app.use(requestLogger);
const allowedCors = ['https://kso.domainname.nomoreparties.co', 'http://localhost:3000'];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));


app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.use(auth);
app.post('/signout', signout);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(3000, () => {
  console.log('Сервер запущен!');
});
