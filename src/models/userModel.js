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
        default: Date.now
    },

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    this.updatedAt = Date.now();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

module.exports = mongoose.model('User', userSchema);