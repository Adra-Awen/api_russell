const express = require('express');
const router = express.Router();

const usersService = require('../services/users');

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Accueil - Port Russell'
  });
})

router.post('/login', usersService.login);
router.get('/logout', usersService.logout);

module.exports = router;