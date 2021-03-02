const crypto = require('crypto');

const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../User/User');
const VerificationToken = require('../EmailVerificationToken/EmailVerificationToken');
const errorHandler = require('../helpers/errorHandler');

dotenv.config();

class AuthController {
    //Helper
    updateUser = async (id, body, res) => {
        const updatedUser = await User.findByIdAndUpdate(id, body);
        if (!updatedUser) {
            return res.status(404).json({ "message":"Not found" });
        }
    }

    generateVerificationToken = async (uid) => {
        const token = await crypto.randomBytes(16).toString('hex');
        return await VerificationToken.create({token, uid})
    }
    
    //API
    register = async (req, res) => {
        const { body } = req;
        
        const { password, email } = body;

        
        try {

            const hashedPassword = await bcrypt.hash(password, 14);
            const subscription = body.subscription ? body.subscription : "free";

            const user =  await User.create({
                ...body,
                password: hashedPassword,
                subscription
            });

            const createdToken = await this.generateVerificationToken(user._id);
            
            const createdUser = {
                email,
                subscription
            }

            res.status(201).json(createdUser);

        } catch (err) {
            errorHandler(err, 500);
        }
    }

    login = async (req, res) => {
        const {
            email,
            password
        } = req.body;
        
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({"message": "Email or password is wrong"})
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({"message": "Email or password is wrong"})
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                },
                process.env.JWT_SECRET
            );
            
            user.token = token;

            await this.updateUser(user._id, user, res);

            const { subscription } = user;

            return res.json({ token, user: { email, subscription } });
        } catch (err) {
            errorHandler(err, 500);
        }
    }

    logout = async (req, res) => {
        const { user } = req;
        if (!user) {
           return res.status(401).json({ "message": "Not authorized" }); 
        }

        user.token = '';

        try {
            this.updateUser(user._id, user, res);
            return res.status(204).send();
        } catch (err) {
            errorHandler(err, 500);
        }
    }

    //middlewares
    authorize = async (req, res, next) => {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            return res.status(401).json({ "message": "Not authorized" });
        }
        
        const token = authHeader.replace('Bearer ', '')
        try {
            const payload = await jwt.verify(token, process.env.JWT_SECRET);
            const { userId } = payload;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(401).json({ "message": "Not authorized" });
            }
            req.user = user;

        } catch (err) {
            return res.status(401).send(err);
        }
        next();
    }

    validateCredentials(req, res, next) {
        const validationRules = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        });
        const validationResult = validationRules.validate(req.body);

        if (validationResult.error) {            
            return res.status(400).send(validationResult.error);
        }
        next();
    }

    validateUniqeEmail = async (req, res, next) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });
            if (user) {
                return res.status(409).json({
                    "message": "Email in use"
                });
            }
            next();
        } catch (err) {
            return errorHandler(err, 500);
        }
    }

}
module.exports = new AuthController();