const express = require('express');
const router = express.Router();

const service = require('../services/users');
const private = require('../middlewares/private')

router.get('/:id/users', private.checkJWT, service.getAllUsers);
router.get ('/:id/users/:email', private.checkJWT, service.getUserByEmail);
router.post('/:id/users', private.checkJWT, service.createUser);
router.put('/:id/users/:email', private.checkJWT, service.updateUser);
router.delete(':id/users/:email', private.checkJWT, service.deleteUser);

module.exports = router;