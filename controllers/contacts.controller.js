const contacts = require('../model/Contacts');
const Joi = require('joi');
const Contacts = require('../model/Contacts');

class ContactController {
    
    //helper
    findContactIndex = async (id) => {
        const contactId = +id;
        const data = await contacts.listContacts(); 
        console.log(data);
        return data.findIndex(({ id }) => id === contactId);
        
    };

    //API
    async getContacts(req, res) {
        try {            
            const data = await contacts.listContacts();
            res.json(data);
        } catch (err) {
            console.error(err);            
            res.status(500).send(err.message); 
        };
    }

    async getContactById(req, res) {
        const {
            params: { contactId },
        } = req;
        console.log(contactId);
        try {
            const data = await contacts.getById(contactId);
            console.log(data);
            res.json(data);

        } catch (err) {
            console.error(err);
            res.status(500).send(err.message); 
        }; 
    
    }

    async createContact(req, res) {
        const { body: {name, email, phone} } = req;
        
        try {
            const createdContact = await contacts.addContact(name, email, phone);
            res.status(201).json(createdContact);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message); 
        }
    }

    deleteContact = async (req, res) => {
        const {
            params: { contactId },
        } = req;

        try {
            await contacts.removeContact(contactId);
            res.status(200).json({"message": "contact deleted"});
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }        
    };

    updateContact = async (req, res) => {
        try {
            const {
                params: { contactId },
            } = req;

            const updatedContact = await contacts.updateContact(contactId, req.body);

            res.json(updatedContact);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }

    };

    //validation middlewares
    validateCreateContact(req, res, next) {
        const validationRules = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
        });
        console.log(req.body);
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
        });

        const validationResult = validationRules.validate(req.body);

        if (validationResult.error) {
            return res.status(400).send(validationResult.error);
        }

        next();
    }

    validateContactId = async (req, res, next) => {
        try {
             const {
            params: { contactId },
            } = req;
            
            const contactIndex = await this.findContactIndex(+contactId);
            console.log(contactId);
            if (contactIndex === -1) {
                return res.status(404).json({message: 'Not found'});
            }
            next();
        } catch (err) {
            next(err);
        }
       

        
    }
}

module.exports = new ContactController();