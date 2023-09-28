const Card = require('../models/card');
const { ERROR_STATUS, SUCCESS_STATUS, SUCCESS_CREATE } = require('../utils/constants');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner }).then((card) => res.status(SUCCESS_CREATE)
    .send({ _id: card._id }))
    .catch((e) => {
      const err = new Error('Ошибка при добавлении карточки');
      if (e.name === 'ValidationError') err.statusCode(ERROR_STATUS[e.name]);
      else err.statusCode(ERROR_STATUS.ServerError);
      next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(SUCCESS_STATUS).send({ data: cards }))
    .catch(() => {
      const err = new Error('Ошибка');
      err.statusCode(ERROR_STATUS.ServerError);
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(() => new Error('NotFoundError'))
    .then((card) => res.status(SUCCESS_STATUS).send({ data: card }))
    .catch((e) => {
      const err = new Error('Ошибка при удалении');
      if (e.name === 'Error') err.statusCode(ERROR_STATUS.CastError);
      else if (e.name === 'CastError') err.statusCode(ERROR_STATUS.ValidationError);
      else err.statusCode(ERROR_STATUS.ServerError);
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => new Error('NotFoundError'))
    .then((card) => res.status(SUCCESS_STATUS).send({ data: card }))
    .catch((e) => {
      const err = new Error('Ошибка при добавлении лайка');
      if (e.name === 'Error') err.statusCode(ERROR_STATUS.CastError);
      else if (e.name === 'CastError') err.statusCode(ERROR_STATUS.ValidationError);
      else err.statusCode(ERROR_STATUS.ServerError);
      next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => new Error('NotFoundError'))
    .then((card) => res.status(SUCCESS_STATUS).send({ data: card }))
    .catch((e) => {
      const err = new Error('Ошибка при удалении лайка');
      if (e.name === 'Error') err.statusCode(ERROR_STATUS.CastError);
      else if (e.name === 'CastError') err.statusCode(ERROR_STATUS.ValidationError);
      else err.statusCode(ERROR_STATUS.ServerError);
      next(err);
    });
};
