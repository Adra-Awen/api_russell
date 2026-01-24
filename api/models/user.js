const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type : String,
        trim : true,
        required : [true, "Le nom d'utilisateur est requis"]
    },
    email: {
        type : String, 
        trim : true,
        required : [true, "L'adresse email est requise"],
        unique : true,
        lowercase : true,
        match: [/.+@+\..+/, "Adresse email invalide"]
    },
    password: {
        type : String,
        trim : true,
        required: [true, "Le mot de passe est requis"],
        minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"]
    }
}, {
    timestamps : true
});

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', User);