const Card = require('../models/card');
const ERROR_STATUS = require('../utils/constants');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner }).then((card) => res.status(201).send({ _id: card._id }))
    .catch((e) => {
      if (e.name === 'ValidationError') res.status(ERROR_STATUS[e.name]).send({ message: 'Переданы некорректные данные' });
      else res.status(ERROR_STATUS.ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      res.status(ERROR_STATUS.ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e.name === 'CastError') res.status(ERROR_STATUS[e.name]).send({ message: 'Карточка с указанным _id не найдена' });
      else res.status(ERROR_STATUS.ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e.name === 'CastError') res.status(ERROR_STATUS[e.name]).send({ message: 'Карточка по указанному _id не найдена' });
      else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e.name === 'CastError') res.status(ERROR_STATUS[e.name]).send({ message: 'Карточка по указанному _id не найдена' });
      else res.status(ERROR_STATUS.ServerError).send({ message: 'Произола ошибка' });
    });
};
