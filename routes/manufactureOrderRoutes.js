const express = require('express');
const router =  express.Router();

const manufactureOrderController = require('../controllers/manufactureOrderController')

//creating a manufacturing order
router.post('/create-manufacture-order', manufactureOrderController.createManufacturingOrder);

//confirm a manufacturing order
router.put('/confirm-manufacture-order', manufactureOrderController.confirmManufacturingOrder);


router.get('/get-manufacture-order/:manufacturingOrderId', manufactureOrderController. getSpecificManufacturingOrder);

module.exports = router;