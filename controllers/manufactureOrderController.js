const xmlrpc = require('xmlrpc');
const { authenticateOdoo } = require('../middlewares/authMiddleware');

const url = '20.164.146.60';
const db = 'bitnami_odoo';
const username = 'user@example.com';
const password = 'FKOF4pOJIV';
const manufacturingModel = 'mrp.production'; // Update with the correct manufacturing model name for Odoo 17

const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });

async function createManufacturingOrder(req, res) {
  try {
      const uid = await authenticateOdoo(username, password);
      if (!uid) {
          return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
      }

      const { salesOrderId, productId, quantity } = req.body;
      if (!salesOrderId || !productId || !quantity) {
          return res.status(400).json({ success: false, error: 'Invalid request data. Sales Order ID, Product ID, and quantity are required.' });
      }

      // Checking if the sales order is confirmed
      const salesOrderClient = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
      salesOrderClient.methodCall('execute_kw', [db, uid, password, 'sale.order', 'read', [[salesOrderId], ['state']]], (error, result) => {
          if (error) {
              return res.status(500).json({ success: false, error: error.message });
          }

          const salesOrderState = result[0].state;
          if (salesOrderState !== 'sale') {
              return res.status(400).json({ success: false, error: 'The sales order must be confirmed before creating a manufacturing order.' });
          }

          // Sales order is confirmed, proceed with creating the manufacturing order
          const manufacturingClient = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
          manufacturingClient.methodCall('execute_kw', [db, uid, password, manufacturingModel, 'create', [{
              'product_id': productId,
              'product_qty': quantity,
              'origin': `SO${salesOrderId}` // Reference to the sales order
          }]], (error, manufacturingOrderId) => {
              if (error) {
                  res.status(500).json({ success: false, error: error.message });
              } else {
                  res.status(201).json({ success: true, message: 'Manufacturing order created successfully.', manufacturingOrderId });
              }
          });
      });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
}



async function confirmManufacturingOrder(req, res) {
    try {
        const uid = await authenticateOdoo(username, password);
        if (!uid) {
            return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
        }

        const { manufacturingOrderId } = req.body;
        if (!manufacturingOrderId) {
            return res.status(400).json({ success: false, error: 'Invalid request data. Manufacturing Order ID is required.' });
        }

        const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
        client.methodCall('execute_kw', [db, uid, password, manufacturingModel, 'action_confirm', [manufacturingOrderId]], (error, result) => {
            if (error) {
                res.status(500).json({ success: false, error: error.message });
            } else {
                res.status(200).json({ success: true, message: 'Manufacturing order has been confirmed successfully.', result });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getSpecificManufacturingOrder(req, res) {
    try {
        const { manufacturingOrderId } = req.params;
        const uid = await authenticateOdoo(username, password);
        if (!uid) {
            return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
        }

        if (!manufacturingOrderId) {
            return res.status(400).json({ success: false, error: 'Invalid request data. Manufacturing Order ID is required.' });
        }

        const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
        client.methodCall('execute_kw', [db, uid, password, manufacturingModel, 'search_read', [[['id', '=', parseInt(manufacturingOrderId)]]]], (error, order) => {
            if (error) {
                res.status(500).json({ success: false, error: error.message });
            } else {
                if (order && order.length > 0) {
                    res.status(200).json({ success: true, order });
                } else {
                    res.status(404).json({ success: false, error: 'Manufacturing order not found.' });
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { createManufacturingOrder, confirmManufacturingOrder, getSpecificManufacturingOrder }
