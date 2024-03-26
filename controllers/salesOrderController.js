const xmlrpc = require('xmlrpc');
const { authenticateOdoo } = require('../middlewares/authMiddleware');

// Odoo instance details
const url = '20.164.146.60';
const db = 'bitnami_odoo';
const password = 'FKOF4pOJIV';


// {
//   "customerId": 11,
//   "productId": 83,
//   "quantity": 5,
//   "unitPrice": 40
// }



// Controller function to create a sales order
async function createSalesOrder(req, res) {
  try {
    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    const { customerId, productId, quantity, unitPrice } = req.body;
    if (!customerId || !productId || !quantity || !unitPrice) {
      return res.status(400).json({ success: false, error: 'Invalid request data. All fields are required.' });
    }

    const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
    client.methodCall('execute_kw', [db, uid, password, 'sale.order', 'create', [{
      'partner_id': customerId,
      'order_line': [[0, 0, {
        'product_id': productId,
        'product_uom_qty': quantity,
        'price_unit': unitPrice
      }]]
    }]], (error, orderId) => {
      if (error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.status(201).json({ success: true, message: 'Sales order created successfully.', orderId });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


// {
//   "orderId":22
// }


// Controller function to confirm a sales order
async function confirmSalesOrder(req, res) {
    try {
      const uid = await authenticateOdoo();
      if (!uid) {
        return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
      }
  
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'Invalid request data. Order ID is required.' });
      }
  
      const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
      client.methodCall('execute_kw', [db, uid, password, 'sale.order', 'action_confirm', [orderId]], (error, result) => {
        if (error) {
          res.status(500).json({ success: false, error: error.message });
        } else {
          res.status(200).json({ success: true, message: 'Sales order has been confirmed successfully.', result });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  async function updateSalesOrder(req, res) {
    try {
      const { orderId, customerId, productId, quantity, unitPrice } = req.body;
      const uid = await authenticateOdoo();
      if (!uid) {
        return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
      }
  
      if (!orderId || !customerId || !productId || !quantity || !unitPrice) {
        return res.status(400).json({ success: false, error: 'Invalid request data. All fields are required.' });
      }
  
      const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
      client.methodCall('execute_kw', [db, uid, password, 'sale.order', 'write', [[orderId], {
        'partner_id': customerId,
        'order_line': [[0, 0, {
          'product_id': productId,
          'product_uom_qty': quantity,
          'price_unit': unitPrice
        }]]
      }]], (error, result) => {
        if (error) {
          res.status(500).json({ success: false, error: error.message });
        } else {
          res.status(200).json({ success: true, message: 'Sales order updated successfully.', result });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
    
  
  async function getAllSalesOrders(req, res) {
    try {
      const uid = await authenticateOdoo();
      if (!uid) {
        return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
      }
  
      const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
      client.methodCall('execute_kw', [db, uid, password, 'sale.order', 'search_read', [[]]], (error, orders) => {
        if (error) {
          res.status(500).json({ success: false, error: error.message });
        } else {
          res.status(200).json({ success: true, orders });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  async function getSpecificSalesOrder(req, res) {
    try {
      const { orderId } = req.params;
      const uid = await authenticateOdoo();
      if (!uid) {
        return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
      }
  
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'Invalid request data. Order ID is required.' });
      }
  
      const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
      client.methodCall('execute_kw', [db, uid, password, 'sale.order', 'search_read', [[['id', '=', parseInt(orderId)]]]], (error, order) => {
        if (error) {
          res.status(500).json({ success: false, error: error.message });
        } else {
          if (order && order.length > 0) {
            res.status(200).json({ success: true, order });
          } else {
            res.status(404).json({ success: false, error: 'Sales order not found.' });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
   



module.exports = { createSalesOrder, confirmSalesOrder, updateSalesOrder, getAllSalesOrders, getSpecificSalesOrder };
