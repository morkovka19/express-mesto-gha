const router = require('express').Router();
const {
  getUsers, getUser, installProfile, installAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', installProfile);
router.patch('/me/avatar', installAvatar);

module.exports = router;
