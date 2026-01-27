const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/** 
@param {import('express').Resquest} req
@param {import('express').Response} res
@param {import('express').NextFunction} next
*/

exports.checkJWT = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({message: 'token_required'});
    }
if (typeof token === 'string' && token.startsWith('Bearer ')) {        token = token.slice(7);
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({message: 'token_not_valid'}); 
        }
        
        req.user = decoded;

    const newToken = jwt.sign(
        {
            id: decoded.id,
            email: decoded.email
        },
        SECRET_KEY,
        { expiresIn: '24h'}
    );

    res.setHeader('Authorization', 'Bearer ' + newToken);

    next();
    });
};