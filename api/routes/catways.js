const express = require('express');
const router = express.Router();

const service = require('../services/catways');
const private = require('../middlewares/private');
const reservationsService = require('../services/reservations');

/* CATWAYS */

/**
 * @openapi
 * /catways:
 *   get:
 *     tags:
 *       - Catways
 *     summary: Récupérer tous les catways
 *     responses:
 *       '200':
 *         description: Liste de tous les catways
 */
router.get('/', private.checkJWT, service.getAllCatways);

/**
 * @openapi
 * /catways:
 *   post:
 *     tags:
 *       - Catways
 *     summary: Créer un nouveau catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: integer
 *               catwayType:
 *                 type: string
 *               catwayState:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catway créé
 */
router.post('/', private.checkJWT, service.createCatway);

/**
 * @openapi
 * /catways/{id}:
 *   get:
 *     tags:
 *       - Catways
 *     summary: Récupérer un catway par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *     responses:
 *       200:
 *         description: Catway trouvé
 *       404:
 *         description: Catway non trouvé
 */
router.get('/:id', private.checkJWT, service.getCatwayById);

/**
 * @openapi
 * /catways/{id}:
 *   put:
 *     tags:
 *       - Catways
 *     summary: Mettre à jour un catway
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
 *               catwayNumber:
 *                 type: integer
 *               catwayType:
 *                 type: string
 *               catwayState:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catway mis à jour
 *       404:
 *         description: Catway non trouvé
 */
router.put('/:id', private.checkJWT, service.updateCatway);

/**
 * @openapi
 * /catways/{id}:
 *   delete:
 *     tags:
 *       - Catways
 *     summary: Supprimer un catway
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *     responses:
 *       200:
 *         description: Catway supprimé
 *       404:
 *         description: Catway non trouvé
 */
router.delete('/:id', private.checkJWT, service.deleteCatway);

/* RÉSERVATIONS */

/**
 * @openapi
 * /catways/{id}/reservations:
 *   get:
 *     tags:
 *       - Réservations
 *     summary: Récupérer les réservations d'un catway
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *     responses:
 *       200:
 *         description: Liste des réservations pour ce catway
 */
router.get('/:id/reservations', private.checkJWT, reservationsService.getReservationsByCatway);

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
router.post('/:id/reservations', private.checkJWT, reservationsService.createReservation);

/**
 * @openapi
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     tags:
 *       - Réservations
 *     summary: Récupérer une réservation par ID
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
 *         description: Réservation non trouvée
 */
router.get('/:id/reservations/:idReservation', private.checkJWT, reservationsService.getReservationById);

/**
 * @openapi
 * /catways/{id}/reservations/{idReservation}:
 *   put:
 *     tags:
 *       - Réservations
 *     summary: Mettre à jour une réservation
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
 *       404:
 *         description: Réservation non trouvée
 */
router.put('/:id/reservations/:idReservation', private.checkJWT, reservationsService.updateReservation);

/**
 * @openapi
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     tags:
 *       - Réservations
 *     summary: Supprimer une réservation
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
 *       404:
 *         description: Réservation non trouvée
 */
router.delete('/:id/reservations/:idReservation', private.checkJWT, reservationsService.deleteReservation);

module.exports = router;
