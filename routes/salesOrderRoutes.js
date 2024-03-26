// routes/salesOrderRoutes.js
const express = require('express');
const router = express.Router();
const salesOrderController = require('../controllers/salesOrderController');

// POST /api/sales-orders
router.post('/create-sales-order', salesOrderController.createSalesOrder);

//confirming the sales order
router.put('/sales-order-confirm/:orderId', salesOrderController.confirmSalesOrder);

//getting all sales order
router.get('/get-all-sales-orders', salesOrderController.getAllSalesOrders);

//updating sales order
router.put('/update-sales-order', salesOrderController.updateSalesOrder);

//getting a specific order
router.get('/get-sales-order/:orderId', salesOrderController.getSpecificSalesOrder);
module.exports = router;
