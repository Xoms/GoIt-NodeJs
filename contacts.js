const fs = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');



const contactsPath = path.relative(`/`, `/db/contacts.json`);

function dataNormalize(data) {
    return JSON.parse(data.toString())
}
function listContacts() {
    fs.readFile(contactsPath)
        .then(data => { 
            const contacts = dataNormalize(data);
            console.log('List of contacts')
            console.table(contacts);
        })
        .catch( err => console.error(err.message))
}

function getContactById(contactId) {
    fs.readFile(contactsPath)
        .then(data => { 
            const contacts = dataNormalize(data);
            const contact = contacts.find(el => el.id === contactId);
            if (contact) {
                console.table(contact);
                return
            } 
            throw new Error(`Sorry, contact with id ${contactId} doesn't exist`)
        })
        .catch( err => console.error(err.message))
}

function removeContact(contactId) {
  fs.readFile(contactsPath)
        .then(data => { 
            const contacts = [...dataNormalize(data)]
            const idx = contacts.findIndex(el => el.id === contactId);
            if (idx === -1) {
                throw new Error(`Can't remove: contact with id ${contactId} doesn't exist`)
            }
            contacts.splice(idx, 1);
            return contacts
        })
      .then(res => {
          console.log('Remove contact result')
          console.table(res);
          fs.writeFile(contactsPath, JSON.stringify(res, 2))
          .then( () => console.log("Contact was deleted"))
        })
        .catch( err => console.error(err.message))
}

function addContact(name, email, phone) {
    const newContact = { id: uuid(), name, email, phone };
    fs.readFile(contactsPath)
        .then(data => { 
            const contacts = dataNormalize(data);
            contacts.push(newContact);
            return contacts
        })
        .then(res => {
            console.log('Add contact result')
            console.table(res)
          fs.writeFile(contactsPath, JSON.stringify(res, 2))
          .then( () => console.log("Contact was added"))
        })
        .catch( err => console.error(err.message))
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}