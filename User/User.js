const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true                            
    },
    avatarURL: {
        type: String,
    },
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free"
    },
    token: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', UserSchema);
