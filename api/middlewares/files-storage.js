const multer = require('multer');

const MIME_TYPE = {
    'image:jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split('').join('_');
        console.log(name)
        const extention = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + name);
    }
});

module.exports = multer({storage: storage});