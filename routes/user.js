
const router = require('express').Router();
const {getUsers, createUser, getUser, installProfile, installAvatar} = require('../controllers/user')

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUser);
router.patch('/me', installProfile);
router.patch('/me/avatar', installAvatar);


module.exports = router;
