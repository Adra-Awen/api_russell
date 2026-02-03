/**
 * @openapi
 * /catways:
 * get:
 * tags:
 * - Catways
 * summary: Récupérer tous les catways
 * responses:
 * 200:
 * description: Succès
 * post:
 * tags:
 * - Catways
 * summary: Créer un catway
 * responses:
 * 201:
 * description: Créé
 *
 * /catways/{id}:
 * get:
 * tags:
 * - Catways
 * summary: Récupérer un catway par ID
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Succès
 * put:
 * tags:
 * - Catways
 * summary: Modifier un catway
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Mis à jour
 * delete:
 * tags:
 * - Catways
 * summary: Supprimer un catway
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 204:
 * description: Supprimé
 *
 * /catways/{id}/reservations:
 * get:
 * tags:
 * - Réservations
 * summary: Liste des réservations d'un catway
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Succès
 * post:
 * tags:
 * - Réservations
 * summary: Créer une réservation
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 201:
 * description: Créée
 *
 * /catways/{id}/reservations/{idReservation}:
 * get:
 * tags:
 * - Réservations
 * summary: Détail d'une réservation
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * - in: path
 * name: idReservation
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Succès
 */

const express = require('express');
const router = express.Router();

const service = require('../services/catways');
const private = require('../middlewares/private');
const reservationsService = require('../services/reservations');

/* CATWAYS */

router.post('/', private.checkJWT, service.createCatway);
router.get('/', private.checkJWT, service.getAllCatways);
router.get('/:id', private.checkJWT, service.getCatwayById);
router.post('/:id/reservations', private.checkJWT, reservationsService.createReservation);
router.put('/:id', private.checkJWT, service.updateCatway);
router.delete('/:id', private.checkJWT, service.deleteCatway);

/* RÉSERVATIONS */

router.get('/:id/reservations', private.checkJWT, reservationsService.getReservationsByCatway);
router.get('/:id/reservations/:idReservation', private.checkJWT, reservationsService.getReservationById);
router.put('/:id/reservations/:idReservation', private.checkJWT, reservationsService.updateReservation);
router.delete('/:id/reservations/:idReservation', private.checkJWT, reservationsService.deleteReservation);

module.exports = router;
