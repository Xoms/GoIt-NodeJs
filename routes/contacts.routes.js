const { Router } = require('express');
const ContactsController = require('../controllers/contacts.controller');

const router = Router();

router.get('/', ContactsController.getContacts);
router.get('/:contactId', ContactsController.validateContactId, ContactsController.getContactById);
router.post('/', ContactsController.validateCreateContact, ContactsController.createContact);
router.delete('/:contactId', ContactsController.validateContactId, ContactsController.deleteContact);
router.patch(
    '/:contactId',
    ContactsController.validateContactId,
    ContactsController.validateUpdateContact,
    ContactsController.updateContact
);

module.exports = router;