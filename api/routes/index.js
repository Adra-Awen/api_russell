var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');

router.get('/', async (requestAnimationFrame, res) => {
  res.status(200).json({
    name : process.env.APP_NAME,
    version : "1.0",
    status : 200,
    message : "Port de Plaisance Russel"
  });
});

router.use('/users', userRoute);

module.exports = router;
