const router = require('express').Router();

const user_controller = require('../controllers/users');

router.route('/').get(user_controller.getUsers);

module.exports = router;
