const xmlrpc = require('xmlrpc');
const { authenticateOdoo } = require('../middlewares/authMiddleware');

const url = '20.164.146.60';
const db = 'bitnami_odoo';
const username = 'user@example.com';
const password = 'FKOF4pOJIV';

const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });


// {
//   "job_data": {
//     "job_title": "Operations Manager.",
//     "department": 2,
//     "location": 1,
//     "description": "We are hiring a skilled Operations Manager.",
//     "requirements": "Bachelor's degree in Business Accounting, experience with Odoo openERP and Microsoft packages."
//   }
// }



async function createJobPosting(req, res) {
  try {
    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    const { job_data } = req.body;
    if (!job_data) {
      return res.status(400).json({ success: false, error: 'Invalid request data.' });
    }

    const { job_title, department_id, location_id, description, requirements } = job_data;
    if (!job_title || !department_id || !location_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields in request data.' });
    }

    client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'create', [{
      'name': job_title,
      'department_id': department_id,
      'address_id': location_id,
      'description': description,
      'requirements': requirements
    }]], (error, value) => {
      if (error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.status(200).json({ success: true, job_id: value });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getJobPostings(req, res) {
  try {
    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'search_read', [[]], { fields: ['id', 'name', 'department_id', 'address_id', 'description', 'requirements'] }], (error, value) => {
      if (error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.status(200).json({ success: true, job_postings: value });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getJobPosting(req, res) {
  try {
    const { job_id } = req.params;
    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'read', [[parseInt(job_id)]], { fields: ['id', 'name', 'department_id', 'address_id', 'description', 'requirements'] }], (error, value) => {
      if (error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        if (value.length === 0) {
          res.status(404).json({ success: false, error: 'Job posting not found.' });
        } else {
          res.status(200).json({ success: true, job_posting: value[0] });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// {
//   "job_data": {
//     "name": "Full Stack Software Developer",
//     "department_id": 3,
//     "address_id": 2,
//     "description": "We are updating the Software Developer job details.",
//     "requirements": "Updated requirements for the Software Developer position."
//   }
// }


async function updateJobPosting(req, res) {
  try {
    const { job_id } = req.params;
    const { job_data } = req.body;
    if (!job_data) {
      return res.status(400).json({ success: false, error: 'Invalid request data.' });
    }

    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'write', [[parseInt(job_id)], job_data]], (error, value) => {
      if (error) {
        if (error.message.includes("Record does not exist or has been deleted")) {
          return res.status(404).json({ success: false, error: 'Job posting not found or has been deleted.' });
        } else {
          return res.status(500).json({ success: false, error: error.message });
        }
      } else {
        res.status(200).json({ success: true, message: 'Job posting updated successfully.' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function deleteJobPosting(req, res) {
  try {
    const { job_id } = req.params;
    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'unlink', [[parseInt(job_id)]]], (error, value) => {
      if (error) {
        if (error.message.includes("Record does not exist or has been deleted")) {
          return res.status(404).json({ success: false, error: 'Job posting not found or has been deleted.' });
        } else {
          return res.status(500).json({ success: false, error: error.message });
        }
      } else {        res.status(200).json({ success: true, message: 'Job posting deleted successfully.' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { createJobPosting, getJobPostings, getJobPosting, updateJobPosting, deleteJobPosting };
