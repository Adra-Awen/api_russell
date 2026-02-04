const express = require('express');
const router = express.Router();

const service = require('../services/users');
const private = require('../middlewares/private')

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Utilisateurs
 *     summary: Récupérer tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 */
router.get('/', private.checkJWT, service.getAllUsers);

/**
 * @openapi
 * /users/{email}:
 *   get:
 *     tags:
 *       - Utilisateurs
 *     summary: Récupérer un utilisateur par email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get ('/:email', private.checkJWT, service.getUserByEmail);

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Utilisateurs
 *     summary: Créer un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               firstname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post('/', private.checkJWT, service.createUser);

/**
 * @openapi
 * /users/{email}:
 *   put:
 *     tags:
 *       - Utilisateurs
 *     summary: Mettre à jour un utilisateur
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               firstname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:email', private.checkJWT, service.updateUser);

/**
 * @openapi
 * /users/{email}:
 *   delete:
 *     tags:
 *       - Utilisateurs
 *     summary: Supprimer un utilisateur
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:email', private.checkJWT, service.deleteUser);

module.exports = router;