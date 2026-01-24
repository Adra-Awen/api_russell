const express = require('express');
const router = express.Router();

const userRoute = require('./users');
const usersService = require('../services/users');

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Accueil'
  });
})

router.post('login', usersService.login);
router.post('logout', usersService.logout);

router.use('/users', userRoute);

module.exports = router;