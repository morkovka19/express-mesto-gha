/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');
const User = require('../models/user');
const { ERROR_STATUS, SUCCESS_STATUS, SUCCESS_CREATE } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => res.send(
    { data: users },
  )).catch(() => {
    res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
  });
};

module.exports.createUser = (req, res) => {
  const { email, password, avatar, login } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      if (isEmail(req.body.email)) {
        User.create({ login, password: hash, email, avatar })
          .then((user) => res.status(SUCCESS_CREATE)
            .send({ data: user })).catch((e) => {
            if (e.name === 'ValidationError') res.status(ERROR_STATUS.ValidationError).send({ message: 'Переданы некорректные данные' });
            else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
          });
      } else res.status(ERROR_STATUS.ValidationError).send({ message: 'Переданы некорректные данные почта' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId).orFail(() => new Error('NotFoundError')).then((user) => res.send({ data: user })).catch((e) => {
    if (e.name === 'Error') res.status(ERROR_STATUS.CastError).send({ message: 'Пользователь по указанному _id не найден' });
    else if (e.name === 'CastError') res.status(ERROR_STATUS.ValidationError).send({ message: 'Пользователь по указанному _id не найден' });
    else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
  });
};

module.exports.installProfile = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { name: req.body.name, about: req.body.about } },
    { new: true, runValidators: true },
  ).orFail(() => new Error('NotFoundError'))
    .then((card) => res.status(SUCCESS_STATUS).send({ data: card }))
    .catch((e) => {
      if (e.name === 'Error') res.status(ERROR_STATUS.CastError).send({ message: 'Переданы некорректные данные' });
      else if (e.name === 'ValidationError') res.status(ERROR_STATUS.ValidationError).send({ message: 'Переданы некорректные данные' });
      else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
    });
};

module.exports.installAvatar = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { avatar: req.body.avatar } },
    { new: true, runValidators: true },
    { useFindAndModify: false },
  ).orFail(() => new Error('NotFoundError'))
    .then((card) => res.status(SUCCESS_STATUS).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ValidationError') res.status(ERROR_STATUS.ValidationError).send({ message: 'Переданы некорректные данные' });
      else if (e.name === 'Error') res.status(ERROR_STATUS.CastError).send({ message: 'Переданы некорректные данные' });
      else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password).select('+password')
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((e) => {
      res
        .status(ERROR_STATUS.TokenError)
        .send({ message: e.message });
    });
};
