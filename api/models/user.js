const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const User = new Schema({
    name: {
        type : String,
        trim : true,
        required : [true, 'Le nom est requis']
    },
    firstname: {
        type : String,
        trim : true
    },
    email: {
        type : String, 
        trim : true,
        required : [true, 'L`email est requis'],
        unique : true,
        lowercase : true
    },
    password: {
        type : String,
        trim : true,
    }
}, {
    timestamps : true
});

User.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', User);