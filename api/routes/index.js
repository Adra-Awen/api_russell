const express = require('express');
const router = express.Router();

const usersService = require('../services/users');
const Catway = require('../models/catway');

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Accueil - Port Russell'
  });
})

router.post('/login', usersService.login);
router.get('/logout', usersService.logout);

router.get('/catways-page', async (req, res) => {
  try {
    const catways = await Catway.find();

    res.render('catways', {
      catways
    });
  } catch (error) {
    res.status(500).json('Erreur Serveur');
  }
});

router.get('/catways-page/new',(req, res) => {
  res.render('catway-form', {error: null});
});

router.post('/catways-page/new', async (req, res) => {
  const { catwayNumber, catwayType, catwayState } = req.body;

  try {
    const existing = await Catway.findOne({catwayNumber});

    if (existing) {
      return res.status(400).render('catway-form', {
        error: "Un catway avec ce numéro existe déjà."
      });
    }

    const catway = new Catway({
      catwayNumber,
      catwayType,
      catwayState
    });

    await catway.save();

    return res.redirect('/catways-page');
  } catch (error) {
    return res.status(500).render('catway-form', {
      error: 'Erreur serveur lors de la création.'
    });
  }
});

module.exports = router;