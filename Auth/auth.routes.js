const { Router } = require('express');
const AuthController = require('./auth.controller');

const router = Router();

router.post('/register', AuthController.validateCredentials, AuthController.validateUniqeEmail, AuthController.register);
router.post('/login',  AuthController.validateCredentials, AuthController.login);
router.post('/logout', AuthController.authorize, AuthController.logout);


module.exports = router;