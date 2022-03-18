const router = require('express').Router();

const user_controller = require('../controllers/users');

router.route('/').get(user_controller.getUsers);

router.route('/:id').get(user_controller.getUser).put(user_controller.updateUser).delete(user_controller.deleteUser);

module.exports = router;
