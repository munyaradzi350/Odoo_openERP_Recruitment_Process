const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// Define routes for offers
router.post('/create-offer', offerController.createOffer);


module.exports = router;
