const fs = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');
const dataNormalize = require('../helpers/dataNormalize');

const contactsPath = path.relative(`/`, `/model/contacts.json`);

class Contacts {    

    listContacts = async () => {
        try {
            const rawData = await fs.readFile(contactsPath);
            return dataNormalize(rawData);
        } catch (err) {
            throw new Error(`Read/write error at ${contactsPath}`);
        }
    }

    getById = async (contactId) => {
        try {
            const rawData = await fs.readFile(contactsPath);
            const contacts = dataNormalize(rawData);
            const contact = contacts.find( ({id}) => id === +contactId);
            if (contact) {
                return contact;
            } 

        } catch (err) {
            throw new Error(`Read/write error at ${contactsPath}`);
        }
    }

    addContact = async (name, email, phone) =>{
        
        try {
            const data = await fs.readFile(contactsPath);            
            const contacts = dataNormalize(data);
            const newContact = { id: uuid(), name, email, phone };
            contacts.push(newContact);
          
            await fs.writeFile(contactsPath, JSON.stringify(contacts, 2))
            console.log("Contact was added");
            return newContact;
           
        } catch (err) {
            throw err;
        }
    }

    removeContact = async (contactId) => {
        try {
            const contacts = await this.listContacts();
            const idx = contacts.findIndex(({ id }) => id === +contactId);
            
            const deleted = contacts.splice(idx, 1);
            
            await fs.writeFile(contactsPath, JSON.stringify(contacts, 2))
            console.log("Contact was removed");

            return deleted;
        } catch (err) {
            throw err
        }
    }

    updateContact = async(contactId, body) => {
        try {
            const contacts = await this.listContacts();
            const idx = contacts.findIndex(({ id }) => id === +contactId);            
            
            const updatedContact = {
                ...contacts[idx],
                ...body
            }
            contacts[idx] = updatedContact;
            
            await fs.writeFile(contactsPath, JSON.stringify(contacts, 2))
            console.log("Contact was updated");

            return updatedContact;
        } catch (err) {
            throw err
        }
    }

}

module.exports = new Contacts();