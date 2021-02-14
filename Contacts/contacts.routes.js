const { Router } = require('express');
const ContactsController = require('./contacts.controller');
const AuthController = require('../Auth/auth.controller');

const router = Router();
router.use(AuthController.authorize)

router.get(
    '/',
    ContactsController.validateQueryParams,
    ContactsController.getContacts
);

router.get(
    '/:contactId',
    ContactsController.validateContactId,
    ContactsController.getContactById);

router.post(
    '/',
    ContactsController.validateCreateContact,
    ContactsController.createContact
);

router.delete(
    '/:contactId',
    ContactsController.validateContactId,
    ContactsController.deleteContact
);

router.patch(
    '/:contactId',
    ContactsController.validateContactId,
    ContactsController.validateUpdateContact,
    ContactsController.updateContact
);

module.exports = router;