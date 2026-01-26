const express = require('express');
const router = express.Router();

const service = require('../services/users');
const private = require('../middlewares/private')

router.get('/', service.getAllUsers);
router.get ('/:email', private.checkJWT, service.getUserByEmail);
router.post('/', service.createUser);
router.put('/:email', private.checkJWT, service.updateUser);
router.delete('/:email', private.checkJWT, service.deleteUser);

module.exports = router;