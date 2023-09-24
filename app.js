/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const user = require('./controllers/user');
const auth = require('./middlewares/auth');

const PORT = 3000;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Conected to db');
});

app.use(errors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
    avatar: Joi.string(),
    password: Joi.string().required().min(8),
    email: Joi.string().required().email(),
  }),
}), user.login);
app.post('/signup', user.createUser);

app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));
app.use('/*', require('./routes/error'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
