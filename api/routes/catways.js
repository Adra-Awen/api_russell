const express = require('express');
const router = express.Router();

const service = require('../services/catways');
const private = require('../middlewares/private');
const reservationsService = require('../services/reservations');

// --- CATWAYS ---

router.post('/', private.checkJWT, service.createCatway);
router.get('/', private.checkJWT, service.getAllCatways);
router.get('/:id', private.checkJWT, service.getCatwayById);
router.post('/:id/reservations', private.checkJWT, reservationsService.createReservation);
router.put('/:id', private.checkJWT, service.updateCatway);
router.delete('/:id', private.checkJWT, service.deleteCatway);

// --- RÉSERVATIONS ---

router.get('/:id/reservations', private.checkJWT, reservationsService.getReservationsByCatway);
router.get('/:id/reservations/:idReservation', private.checkJWT, reservationsService.getReservationById);
router.put('/:id/reservations/:idReservation', private.checkJWT, reservationsService.updateReservation);
router.delete('/:id/reservations/:idReservation', private.checkJWT, reservationsService.deleteReservation);

module.exports = router;
