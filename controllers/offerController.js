const xmlrpc = require('xmlrpc');
const { authenticateOdoo } = require('../middlewares/authMiddleware');

// Odoo instance details
const url = '20.164.146.60';
const db = 'bitnami_odoo';
const password = 'FKOF4pOJIV';


// {
//   "jobId": 21,
//   "departmentId": 1,
//   "description": "We are looking for a skilled Software Engineer to join our team.",
//   "application_status": "new",
//   "attachment_ids": [],
//   "availability": "2024-04-01",
//   "categ_ids": [1, 2],
//   "company_id": 1,
//   "date_open": "2024-03-26",
//   "emp_id": 1,
//   "emp_is_active": true,
//   "employee_name": "John Doe",
//   "has_message": true
// }


// Controller function to create an offer
async function createOffer(req, res) {
  try {
    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    const { jobId, departmentId, description, application_status, attachment_ids, availability, categ_ids, company_id, date_open, emp_id, emp_is_active, employee_name, has_message } = req.body;
    if (!jobId || !departmentId || !description || !application_status || !attachment_ids || !availability || !categ_ids || !company_id || !date_open || !emp_id || !emp_is_active || !employee_name || !has_message) {
      return res.status(400).json({ success: false, error: 'Invalid request data. All fields are required.' });
    }

    const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
    client.methodCall('execute_kw', [db, uid, password, 'hr.applicant', 'create', [{
      'name': jobId,
      'department_id': departmentId,
      'description': description,
      'application_status': application_status,
      'attachment_ids': attachment_ids,
      'availability': availability,
      'categ_ids': categ_ids,
      'company_id': company_id,
      'date_open': date_open,
      'emp_id': emp_id,
      'emp_is_active': emp_is_active,
      'employee_name': employee_name,
      'has_message': has_message
    }]], (error, jobId) => {
      if (error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.status(201).json({ success: true, message: 'Offer created successfully.', jobId });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { createOffer };
