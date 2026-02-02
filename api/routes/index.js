const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const usersService = require('../services/users');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const User = require('../models/user');


/*LOGIN*/
function ensureAuthenticated(req, res, next) {
  if(!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  next();
}

router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

router.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', {error: null});
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).render('login', {
        error: 'Utilisateur introuvable.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).render('login', {
        error: "Mot de passe incorrecte."
      });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    return res.redirect('/dashboard');
  } catch (error) {
    return res.status(500).render('login', {
      error: 'Erreur serveur lors de la connexion.'
    });
  }
});

/*INSCRIPTION*/
router.get('/register', (req, res) => {
  res.render('register', {error: null});
});

router.post('/register', async (req, res) => {
  const {username, email, password} = req.body;

  if(!email.endsWith('@portrussell.fr')) {
    return res.render('register', {
      error: "L'adresse email doit se terminer par @portrussell.fr"
    });
  }

  try {
    const exisiting = await User.findOne({email});

    if (exisiting) {
      return res.status(400).render('register', {
        error: 'Un compte existe déjà avec cet e-mail'
      });
    }

    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    return res.redirect('/login');
  }catch (error) {
    console.error('Erreur inscription :', error);
    return res.status(500).render('register', {
      error: 'Erreur serveur lors de la création du compte.'
    });
  }
});

/*DASHBOARD*/

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.session.user
  });
});

/*LOGOUT*/

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

/*UTILISATEURS*/
router.get('/users-page', ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.render('users', { users });
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

router.get('/users-page', async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/users-page/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/users-page/:id/edit', async (req, res) => {
    const {id} = req.params;
    const { username, email, password } = req.body;

    try {
      const user = await User.findById(id);

      if(!user) {
        return res.status(404).send('Utilisateur introuvable');
      }

      user.username = username;
      user.email = email;
      
      if (password && password.length >0) {
        user.password = password;
      }

      await user.save();
      res.redirect('/users-page');
    } catch (error) {
      res.status(500).send("Erreur lors de la modification de l'utilisateur")
    }
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email et password sont obligatoires.' });
    }
});

router.put('/users-page/:id', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    if (username !== undefined) user.username = username;
    if (email !== undefined) {
      if (!email.endsWith('@portrussell.fr')) {
        return res.status(400).json({ error: "L'adresse email doit se terminer par @portrussell.fr" });
      }
      user.email = email;
    }
    if (password !== undefined && password !== '') {
      user.password = password;
    }

    await user.save(); 

    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json(userSafe);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/users-page/:id/delete', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.redirect('/users-page');
    } catch (error) {
    res.status(500).send("Erreur lors de la suppression de l'utilisateur.");
    }
  });

/*CATWAYS*/
router.get('/catways-page', ensureAuthenticated, async (req, res) => {
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

router.post('/catways-page/new', ensureAuthenticated, async (req, res) => {
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
router.get('/reservations-page', ensureAuthenticated, async (req, res) => {
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

router.post('/reservations-page/new', ensureAuthenticated, async (req, res) => {
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