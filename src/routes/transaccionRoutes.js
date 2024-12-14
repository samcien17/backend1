const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');

router.get('/', transaccionController.getTransacciones);
router.post('/', transaccionController.createTransaccion);
router.get('/:id', transaccionController.getTransaccionById);

module.exports = router;