const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @route GET /users
 */

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * @route GET /users/:email
 */

exports.getUserByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({email}).select('-password');
    if(!user) {
        return res.status(404).json({message: "user_not_found"});
    }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * @route POST /users/:email
 */

exports.createUser = async (req, res) => {
    const {username, email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status (409).json({message: "email_already_used"});
        }

        const user = new User({
            username,
            email,
            password
        });

        await user.save ();

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * @route PUT /users/:email
 */

exports.updateUser = async (req, res) => {
    const email = req.params.email;
    const {username, newEmail, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: "user_not_found"});
        }

        if (username) user.username = username;
        if (newEmail) user.email = newEmail;

        if (password) {
            user.password = password;
        }

        await user.save();

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * @route DELETE /users/:email
 */

exports.deleteUser = async (req, res) => {
    const email = req.params.email;

    try {
        const user = await User.findOneAndDelete({email});
        if (!user) {
            return res.status(404).json({message: "user_not_found"});
        }

       return res.status(200).json({message: "user_deleted"}); 
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * @route POST /login
 */

exports.login = async (req, res) => {
    const { email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
             return res.status(401).json({message: "invalid_credentials"});
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
             return res.status(401).json({message: "invalid_credentials"});
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            SECRET_KEY,
            {expiresIn: '24h'}
        );

        res.setHeader('Authorization', 'Bearer' + token);

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(200).json({
            message: 'login_success',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * @route GET /logout
 */

exports.logout = async (req,res) => {
    return res.status(200).json({message: 'logout_success'});
};