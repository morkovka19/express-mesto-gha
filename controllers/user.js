const User = require('../models/user');
const ERROR_STATUS = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => res.send(
    { data: users },
  )).catch(() => {
    res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
  });
};

module.exports.createUser = (req, res) => {
  User.create(req.body).then((user) => res.status(201).send({ data: user })).catch((e) => {
    if (e.name === 'ValidationError') res.status(ERROR_STATUS.ValidationError).send({ message: 'Переданы некорректные данные' });
    else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
  });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId).orFail().then((user) => res.send({ data: user })).catch((e) => {
    console.log(e.name);
    if (e.name === 'DocumentNotFoundError') res.status(ERROR_STATUS.CastError).send({ message: 'Пользователь по указанному _id не найден' });
    if (e.name === 'CastError') res.status(ERROR_STATUS.CastError).send({ message: 'Пользователь по указанному _id не найден' });
    else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
  });
};

module.exports.installProfile = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { name: req.body.name, about: req.body.about } },
    { new: true },
    { useFindAndModify: false },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ValidationError') res.status(ERROR_STATUS.ValidationError).send({ message: 'Переданы некорректные данные' });
      else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
    });
};

module.exports.installAvatar = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { avatar: req.body.avatar } },
    { new: true },
    { useFindAndModify: false },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ValidationError') res.status(ERROR_STATUS.ValidationError).send({ message: 'Переданы некорректные данные' });
      else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
    });
};
