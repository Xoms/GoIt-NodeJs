const User = require('./User');
const Joi = require('joi');
const errorHandler = require('../helpers/errorHandler');
const fs = require('fs').promises;
const path = require('path');

class UserController {

    getCurrentUser(req, res) {
        const { user } = req;
        if (!user) {
            return res.status(401).json({ "message": "Not authorized" });
        }
        const { email, subsciption } = user;

        return res.json({ email, subsciption })
    }

    updateUserSubscription = async (req, res) => {
        const { user, body } = req;
        
        if (!user) {
            return res.status(401).json({ "message": "Not authorized" });
        }
        user.subsciption = body.subsciption;
        try {
            const updatedUser = await User.findByIdAndUpdate(user._id, user);
            return res.send({ subscription: user.subsciption });
        } catch (error) {
            errorHandler(error, 500);
        }
    }

    updateAvatar = async (req, res) => {
        const { user, file } = req;

        if (!file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        if (!user) {            
            return res.status(401).json({ "message": "Not authorized" });
        }

        try {
            console.log("User in controller", user);
            console.log(user.avatarURL);
            const updatedUser = User.findByIdAndUpdate(user._id, user);
            return res.json({ avatarURL: user.avatarURL });
        } catch (error) {
            errorHandler(error, 500);
        }        
    }


    //middlewares
    validateSubscription(req, res, next) {
        const validationRules = Joi.object({
            subsciption: Joi.string().valid('free', 'pro', 'premium')
        });
        const validationResult = validationRules.validate(req.body);

        if (validationResult.error) {            
            return res.status(400).send(validationResult.error);
        }
        next();
    }
}

module.exports = new UserController();