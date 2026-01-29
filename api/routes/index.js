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

router.post('/catways-page/:id/edit', async (req, res) => {
  const id = Number(req.params.id);
  const { catwayState, catwayType } = req.body;

  try {
    const catway  = await Catway.findOne({catwayNumber: id});

    if (!catway) {
      return res.status(400).send('Catway introuvable');
    }

    if(catwayType !== undefined) {
      catway.catwayType = catwayType;
    }

    if(catwayState !== undefined) {
      catway.catwayState = catwayState;
    }

    catway.catwayState = catwayState;

    await catway.save();

    return res.redirect('/catways-page');
  } catch (error) {
    return res.status(500).send('Erreur serveur lors de la modification.');
  }
});

module.exports = router;