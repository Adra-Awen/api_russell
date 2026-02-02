const express = require('express');
const router = express.Router();

const service = require('../services/reservations');
const private = require('../middlewares/private')

router.get('/:id/reservations', private.checkJWT, reservationsService.getReservationByCatway);
router.get ('/:id/reservations/:idReservation', private.checkJWT, reservationsService.getReservationById);
router.post('/id/reservation', private.checkJWT, reservationsService.createReservation);
router.put('/:id/reservations/:idReservation', private.checkJWT, reservationsService.updateReservation);
router.delete('/:id/reservations/:idReservation', private.checkJWT, reservationsService.deleteReservation);

