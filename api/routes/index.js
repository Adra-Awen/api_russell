const express = require('express');
const router = express.Router();

const userRoute = require('./users');

router.get('/', (req, res) => {
  console.log("Route / appelée");
  res.render('index', {
    title: 'Accueil'
  });
})

router.use('/users', userRoute);

module.exports = router;