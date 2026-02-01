const express = require('express');
const router = express.Router();

const usersService = require('../services/users');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Accueil - Port Russell'
  });
})

router.post('/login', usersService.login);
router.get('/logout', usersService.logout);


/*CATWAYS*/
router.get('/catways-page', async (req, res) => {
  try {
    const catways = await Catway.find().sort({catwayNumber: 1});
    const reservations = await Reservation.find();
    const today = new Date().setHours(0, 0, 0, 0);
    const catwaysWithStatus = catways.map(c => {
      const hasActiveReservation = reservations.some(r =>
        r.catwayNumber === c.catwayNumber &&
        new Date(r.startDate).setHours(0,0,0,0) <= today &&
        new Date(r.endDate).setHours(0,0,0,0) >= today
      );

      return {
        ...c.toObject(),
        status: hasActiveReservation ? "occupé" : "libre"
      };
    });

    res.render('catways', {
      catways: catwaysWithStatus
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
});   

router.get('/catways-page/new',(req, res) => {
  res.render('catway-form', {error: null});
});

router.post('/catways-page/new', async (req, res) => {
  const { catwayNumber, catwayType, catwayState } = req.body;

  try {
    const existing = await Catway.findOne({ catwayNumber });

    if (existing) {
      return res.status(400).render('catway-form', {
        error: 'Un catway avec ce numéro existe déjà.'
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
    console.error('Erreur création catway-page : ', error);
    return res.status(500).render('catway-form', {
      error: 'Erreur serveur lors de la création du catway.'
    });
  }
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

router.post('/catways-page/:id/delete', async (req, res) => {
  const id = Number(req.params.id);

  try {
    await Catway.findOneAndDelete({ catwayNumber: id });
    return res.redirect('/catways-page');
  } catch (error) {
    console.error('Erreur suppression catway-page : ', error);
    return res.status(500).send('Erreur lors de la suppression');
  }
});


/*RESERVATIONS*/
router.get('/reservations-page', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({startDate: 1});

    res.render('reservations', {
      reservations
    });
  } catch (error) {
    res.status(500).json('Erreur Serveur');
  }
});

router.get('/reservations-page/new', (req, res) => {
  res.render('reservation-form', {error: null});
});

router.post('/reservations-page/new', async (req, res) => {
  const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

  try {
    if (!catwayNumber || !clientName || !boatName || !startDate || !endDate) {
      return res.status(400).render('reservation-form', {
        error: 'Tous les champs sont obligatoires.'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).render('reservation-form', {
        error: 'Les dates sont invalides (la date de fin doit être après la date de début).'
      });
    }

    const reservation = new Reservation({
      catwayNumber: Number(catwayNumber),
      clientName,
      boatName,
      startDate: start,
      endDate: end
    });

    await reservation.save();

    return res.redirect('/reservations-page');
  } catch (error) {
    console.error('Erreur création réservation : ', error);
    return res.status(500).render('reservation-form', {
      error: 'Erreur serveur lors de la création de la réservation.'
    });
  }
});


router.post('/reservations-page/:id/edit', async (req, res) => {
  const { id } = req.params;
  const { clientName, boatName, catwayNumber, startDate, endDate } = req.body;

  try {
    await Reservation.findByIdAndUpdate(id, {
      clientName,
      boatName,
      catwayNumber: Number(catwayNumber),
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });

    return res.redirect('/reservations-page');
  } catch (err) {
    return res.status(500).send("Erreur lors de la modification.");
  }
});

router.post('/reservations-page/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {

    await Reservation.findByIdAndDelete(id);

    return res.redirect('/reservations-page');
  } catch (error) {
    return res.status(500).send('Erreur lors de la suppression de la réservation.');
  }
});


module.exports = router;