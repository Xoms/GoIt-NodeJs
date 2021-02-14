const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

/* Example:
"name":"Allen Raymond",
"email":"nulla.ante@vestibul.co.uk",
"phone":"(992) 914-3792",
"subscription":"free",
"password":"password",
"token":""
*/

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,                      
    },
    phone: {
        type: String,
        required: true
    },
    //next fields is not required in current homework 
    subscription: {
        type: String,
        //required: true
    },
    password: {
        type: String,
        //required: true
    },
    token: {
        type: String,
        //required: true
    },
})
ContactSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Contact', ContactSchema);