const User = require('./User');
const Joi = require('joi');
const errorHandler = require('../helpers/errorHandler');

class UserController {

    getCurrentUser(req, res) {
        const { user } = req;
        if (!user) {
            return res.status(401).json({ "message": "Not authorized" });
        }
        const { email, subsciption } = user;

        return res.json({ email, subsciption })
    }

    updateUser = async (req, res) => {
        const { user, body } = req;
        
        if (!user) {
            return res.status(401).json({ "message": "Not authorized" });
        }
        user.subsciption = body.subsciption;
        try {
            const updatedUser = User.findByIdAndUpdate(user._id, user);
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