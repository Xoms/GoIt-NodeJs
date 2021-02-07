const Contact = require('../model/Contact');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {
    Types: { ObjectId },
} = require('mongoose');
const errorHandler = require('../helpers/errorHandler');


class ContactController {    

    //API
    getContacts = async (req, res) => {
        try {            
            const data = await Contact.find();
            res.json(data);
        } catch (err) {
            errorHandler(err, 500);
        };
    }

    getContactById = async (req, res) => {
        const {
            params: { contactId },
        } = req;
        
         try {            
            const contact = await Contact.findById(contactId);
            console.log(contact);
           
            
            if (!contact) {
                return res.status(404).json({ "message":"Not found" });
            }
            
            res.json(contact);
            
        } catch (err) {
            errorHandler(err, 500);
        }; 
    
    }

    createContact = async (req, res) =>{
        const { body } = req;
        
        try {
            const createdContact = await Contact.create(body);
            res.status(201).json(createdContact);
            //непонятно зачем поле "__v": 0
        } catch (err) {
            errorHandler(err, 500);
        }
    }

    deleteContact = async (req, res) => {
        const {
            params: { contactId },
        } = req;

        try {
            const deletedContact = await Contact.findByIdAndDelete(contactId);
            res.status(200).json({ "message":"Contact deleted" });

            if (!deletedContact) {
                return res.status(404).json({ "message":"Not found" });
            }

        } catch (err) {
            errorHandler(err, 500);
        }        
    };

    updateContact = async (req, res) => {
        const {
                params: { contactId },
        } = req;

        try {
            const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
                new: true,
            });
            if (!updatedContact) {
                return res.status(404).json({ "message":"Not found" });
            }

            res.json(updatedContact);
        } catch (err) {
            errorHandler(err, 500, res);
        }

    };

    //validation middlewares
    validateCreateContact(req, res, next) {
        const validationRules = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
        });
        const validationResult = validationRules.validate(req.body);

        if (validationResult.error) {            
            return res.status(400).send(validationResult.error);
        }
        next();
    }

    validateUpdateContact(req, res, next) {
        const validationRules = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            password: Joi.string(),
        }).min(1);

        const validationResult = validationRules.validate(req.body);

        if (validationResult.error) {
            return res.status(400).send(validationResult.error);
        }
        next();
    }

    validateContactId = (req, res, next) => {
        const {
            params: { contactId },
        } = req;

        if (!ObjectId.isValid(contactId)) {
            return res.status(400).json({ "message":"Your id is not valid" });
        }

        /* OR
        const validationRules = Joi.object({
            contactId: Joi.objectId().required
        });
        const validationResult = validationRules.validate({contactId});

        if (validationResult.error) {
            return res.status(400).send(validationResult.error);
        }
        */
        
        next();
    }
}

module.exports = new ContactController();