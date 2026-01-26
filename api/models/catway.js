const mongoose = require('mongoose');

const CatwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: true,
        unique: true
    },
    catwayType: {
        type: String,
        required: true,
        enum: ['long', 'short']
    },
    catwayState: {
        type: String,
        required: true,
        trim: true,
        maxlenght: 500
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Catway', CatwaySchema);