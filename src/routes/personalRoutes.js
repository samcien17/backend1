const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalController');

router.get('/', personalController.getPersonal);
router.post('/', personalController.createPersonal);
router.get('/:id', personalController.getPersonalById);

module.exports = router;