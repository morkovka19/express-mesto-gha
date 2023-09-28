/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');
const User = require('../models/user');
const { ERROR_STATUS, SUCCESS_STATUS, SUCCESS_CREATE } = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({}).then((users) => res.send(
    { data: users },
  )).catch(() => {
    const err = new Error('Ошибка');
    err.statusCode(ERROR_STATUS.ServerError);
    next(err);
  });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, avatar, login } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      if (isEmail(req.body.email)) {
        User.create({ login, password: hash, email, avatar })
          .then((user) => res.status(SUCCESS_CREATE)
            .send({ data: user.$ignore('password') })).catch((e) => {
            const err = new Error('Ошибка при регистрации');
            if (e.name === 'ValidationError') err.status(ERROR_STATUS.ValidationError);
            else if (e.code === 11000) err.status(ERROR_STATUS.DBError);
            else err.statusCode(ERROR_STATUS.ServerError);
            next(err);
          });
      } else {
        const err = new Error('Ошибка при регистрации');
        err.statusCode(ERROR_STATUS.ValidationError);
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId).orFail(() => new Error('NotFoundError')).then((user) => res.send({ data: user })).catch((e) => {
    const err = new Error('Ошибка');
    if (e.name === 'Error') err.statusCode(ERROR_STATUS.CastError);
    else if (e.name === 'CastError') err.statusCodestatus(ERROR_STATUS.ValidationError);
    else err.statusCode(ERROR_STATUS.ServerError);
    next(err);
  });
};

module.exports.installProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { name: req.body.name, about: req.body.about } },
    { new: true, runValidators: true },
  ).orFail(() => new Error('NotFoundError'))
    .then((card) => res.status(SUCCESS_STATUS).send({ data: card }))
    .catch((e) => {
      const err = new Error('Ошибка при редактировании');
      if (e.name === 'Error') err.statusCode(ERROR_STATUS.CastError);
      else if (e.name === 'ValidationError') err.statusCode(ERROR_STATUS.ValidationError);
      else err.statusCode(ERROR_STATUS.ServerError);
      next(err);
    });
};

module.exports.installAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { avatar: req.body.avatar } },
    { new: true, runValidators: true },
    { useFindAndModify: false },
  ).orFail(() => new Error('NotFoundError'))
    .then((card) => res.status(SUCCESS_STATUS).send({ data: card }))
    .catch((e) => {
      const err = new Error('Ошибка при редактировании');
      if (e.name === 'ValidationError') err.statusError = ERROR_STATUS.ValidationError;
      else if (e.name === 'Error') err.statusError = ERROR_STATUS.CastError;
      else err.statusError = ERROR_STATUS.ServerError;
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password).select('+password')
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      const err = new Error('ОШибка авторизации');
      err.statusCode = ERROR_STATUS.ValidationError;
      next(err);
    });
};
