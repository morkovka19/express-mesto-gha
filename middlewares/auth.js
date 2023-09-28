/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { ERROE_STATUS } = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Ошибка при авторизации');
    err.statusCode = ERROE_STATUS.TokenError;
    return next(err);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (e) {
    const err = new Error('Ошибка при авторизации');
    err.statusCode = ERROE_STATUS.TokenError;
    return next(err);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
