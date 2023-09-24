const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUser, installProfile, installAvatar,
} = require('../controllers/user');

router.get('/', auth, getUsers);
router.get('/:userId', auth, getUser);
router.patch('/me', auth, installProfile);
router.patch('/me/avatar', auth, installAvatar);

module.exports = router;
