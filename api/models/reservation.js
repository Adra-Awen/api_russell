const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: true,
        unique: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    boatName: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return !this.startDate || value > this.startDate;
            },
            message: "La date de fin doit être postérieure à la date de début."
        }
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model('Reservation', ReservationSchema);