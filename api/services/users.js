const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let user = await User.findById(id);

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.add = async (req, res, next) => {

    const temp = ({
        name : req.body.name,
        firstname : req.body.firstname,
        email : req.body.email,
        password : req.body.password,
    });

    try {
        let user = await User.create(temp);
        return res.status(201).json(user);
    } catch (error) {
        console.error('Erreur création user :', error);
        return res.status(501).json(error );
    }
}

exports.update = async (req, res, next) => {
    const id =  req.params.id
    const temp = ({
        name : req.body.name,
        firstname : req.body.firstname,
        email : req.body.email,
        password : req.body.password
    });

    try {
        let user = await User.findOne({_id : id});

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user [key] = temp[key];
                }
            });

            await user.save();
            return res.status(201).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.delete = async (req, res, next) => {
    const id = req.params.id

    try {
        await User.deleteOne({_id: id});

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne(
            { email },
            '-__v -createdAt -updatedAt'
        );

        if (!user) {
            return res.status(404).json('user_not_found');
        }

        bcrypt.compare(password, user.password, (err, response) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (!response) {
                return res.status(403).json('wrong_credentials');
            }

            delete user._doc.password;

            const expireIn = 24 * 60 * 60;

            const token = jwt.sign(
                { user },
                SECRET_KEY,
                { expiresIn: expireIn }
            );

            res.header('Authorization', 'Bearer ' + token);

            return res.status(200).json('authenticate_succeed');
        });

    } catch (error) {
        return res.status(500).json(error);
    }
};
