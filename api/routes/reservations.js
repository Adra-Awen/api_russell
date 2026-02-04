const express = require('express');
const router = express.Router();

const service = require('../services/reservations');
const private = require('../middlewares/private')

/**
 * @openapi
 * /catways/{id}/reservations:
 *   get:
 *     tags:
 *       - Réservations
 *     summary: Récupérer toutes les réservations d'un catway
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get('/:id/reservations', private.checkJWT, reservationsService.getReservationByCatway);

/**
 * @openapi
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     tags:
 *       - Réservations
 *     summary: Récupérer une réservation par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation trouvée
 *       404:
 *         description: Réservation introuvable
 */
router.get ('/:id/reservations/:idReservation', private.checkJWT, reservationsService.getReservationById);

/**
 * @openapi
 * /catways/{id}/reservations:
 *   post:
 *     tags:
 *       - Réservations
 *     summary: Créer une réservation pour un catway
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Réservation créée
 */
router.post('/:id/reservation', private.checkJWT, reservationsService.createReservation);

/**
 * @openapi
 * /catways/{id}/reservations/{idReservation}:
 *   put:
 *     tags:
 *       - Réservations
 *     summary: Mettre à jour une réservation existante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 */
router.put('/:id/reservations/:idReservation', private.checkJWT, reservationsService.updateReservation);

/**
 * @openapi
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     tags:
 *       - Réservations
 *     summary: Supprimer une réservation existante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée
 */
router.delete('/:id/reservations/:idReservation', private.checkJWT, reservationsService.deleteReservation);

module.exports = router;