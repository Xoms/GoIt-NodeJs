const { Router } = require('express');
const AuthController = require('../Auth/auth.controller');
const UserController = require('./user.controller');

const router = Router();

router.get('/current', AuthController.authorize, UserController.getCurrentUser);
router.patch(
    '/',
    AuthController.authorize,
    UserController.validateSubscription,
    UserController.updateUser);

module.exports = router;