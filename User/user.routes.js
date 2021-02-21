const { Router } = require('express');
const AuthController = require('../Auth/auth.controller');
const UserController = require('./user.controller');
const upload = require('../utils/multer.config');
const minifyImages = require('../utils/imagemin');
const router = Router();

router.get('/current', AuthController.authorize, UserController.getCurrentUser);
router.patch(
    '/',
    AuthController.authorize,
    UserController.validateSubscription,
    UserController.updateUserSubscription);
router.patch(
    '/avatar',
    AuthController.authorize,
    upload.single('avatar'),
    minifyImages,
    UserController.updateAvatar);

module.exports = router;