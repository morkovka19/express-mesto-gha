const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCard, likeCard, deleteLike,
} = require('../controllers/card');

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, likeCard);
router.delete('/:cardId/likes', auth, deleteLike);

module.exports = router;
