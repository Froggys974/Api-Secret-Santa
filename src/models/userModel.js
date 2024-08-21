const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: { 
        type: String, 
        required: true,
        unique: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 

    },
    updatedAt: { 
        type: Date, 
    },

});

module.exports = mongoose.model('User', userSchema);