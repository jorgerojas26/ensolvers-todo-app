const router = require('express').Router();

const auth_controller = require('../controllers/auth.js');

router.route('/signin').post(auth_controller.signIn);

router.route('/signup').post(auth_controller.register);

module.exports = router;
