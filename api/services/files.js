const {storage} = require('../middlewares/files-storage');
const File = require('../models/file');
const fs = require('fs')

exports.createOneFile= (req, res, next) => {
    const file = new File({
        name: req.file.filename,
        imageUrl: `${req.protocol}://localhost:300/uploads/${req.file.filename}`,
        userId: req.body.userId
    });

    file.save()
    .then(() => {res.status(201).json({message: 'Object enregistré.'})})
    .catch(error => {res.status(400).json( {error})})
};