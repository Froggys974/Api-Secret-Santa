const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

groupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});


module.exports =  mongoose.model('Group', groupSchema);
