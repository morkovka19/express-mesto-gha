const router = require('express').Router();
const { errorRouter } = require('../controllers/error');

module.exports = router.use('/', errorRouter);
