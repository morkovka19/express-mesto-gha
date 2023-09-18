const { ERROR_STATUS } = require('../utils/constants');

module.exports.errorRouter = (req, res) => {
  res.status(ERROR_STATUS.CastError).send({ message: 'Неправильный url' });
};
