// const express = require('express');
// const xmlrpc = require('xmlrpc');

// const app = express();
// const port = 3000; // Change the port as needed

// // Odoo instance details
// const url = '20.164.146.60';
// const db = 'bitnami_odoo';
// const username = 'user@example.com';
// const password = 'FKOF4pOJIV';

// function authenticateOdoo() {
//   const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/common' });
//   return new Promise((resolve, reject) => {
//     client.methodCall('authenticate', [db, username, password, {}], (error, value) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(value);
//       }
//     });
//   });
// }

// app.use(express.json());


// // {
// //     "job_data": {
// //       "job_title": "Seller",
// //       "department": 1,
// //       "location": 1,
// //       "description": "We are hiring a skilled Software Engineer.",
// //       "requirements": "Bachelor's degree in Computer Science, experience with Python and Django."
// //     }
// //   }

// app.post('/create_job_posting', async (req, res) => {
//   try {
//     const uid = await authenticateOdoo();
//     if (!uid) {
//       return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
//     }

//     const { job_data } = req.body;
//     if (!job_data) {
//       return res.status(400).json({ success: false, error: 'Invalid request data.' });
//     }

//     const { job_title, department, location, description, requirements } = job_data;
//     if (!job_title || !department || !location) {
//       return res.status(400).json({ success: false, error: 'Missing required fields in request data.' });
//     }

//     const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
//     client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'create', [{
//       'name': job_title,
//       'department_id': department,
//       'address_id': location,
//       'description': description,
//       'requirements': requirements
//     }]], (error, value) => {
//       if (error) {
//         res.status(500).json({ success: false, error: error.message });
//       } else {
//         res.status(200).json({ success: true, job_id: value });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// //getting all job posting in the Odoo instance
// app.get('/get_job_postings', async (req, res) => {
//   try {
//     const uid = await authenticateOdoo();
//     if (!uid) {
//       return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
//     }

//     const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
//     client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'search_read', [[]], { fields: ['id', 'name', 'department_id', 'address_id', 'description', 'requirements'] }], (error, value) => {
//       if (error) {
//         res.status(500).json({ success: false, error: error.message });
//       } else {
//         res.status(200).json({ success: true, job_postings: value });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// //getting a single job posting by id
// app.get('/get_job_posting/:job_id', async (req, res) => {
//   try {
//     const { job_id } = req.params;
//     const uid = await authenticateOdoo();
//     if (!uid) {
//       return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
//     }

//     const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
//     client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'read', [[parseInt(job_id)]], { fields: ['id', 'name', 'department_id', 'address_id', 'description', 'requirements'] }], (error, value) => {
//       if (error) {
//         res.status(500).json({ success: false, error: error.message });
//       } else {
//         if (value.length === 0) {
//           res.status(404).json({ success: false, error: 'Job posting not found.' });
//         } else {
//           res.status(200).json({ success: true, job_posting: value[0] });
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// // {
// //   "job_data": {
// //     "name": "Senior Software Dev", 
// //     "department_id": 2, 
// //     "address_id": 1, 
// //     "description": "We are hiring a senior Software DEveloper with 5+ years of experience.",
// //     "requirements": "Bachelor's degree in Computer Science, experience with Python, Django, and leadership skills."
// //   }
// // }

// app.put('/update_job_posting/:job_id', async (req, res) => {
//   try {
//     const { job_id } = req.params;
//     const { job_data } = req.body;
//     if (!job_data) {
//       return res.status(400).json({ success: false, error: 'Invalid request data.' });
//     }

//     const uid = await authenticateOdoo();
//     if (!uid) {
//       return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
//     }

//     const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
//     client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'write', [[parseInt(job_id)], job_data]], (error, value) => {
//       if (error) {
//         // Handle specific error message indicating record not found or deleted
//         if (error.message.includes("Record does not exist or has been deleted")) {
//           return res.status(404).json({ success: false, error: 'Job posting not found or has been deleted.' });
//         } else {
//           // Handle other errors
//           return res.status(500).json({ success: false, error: error.message });
//         }
//       } else {
//         // Job posting updated successfully
//         res.status(200).json({ success: true, message: 'Job posting updated successfully.' });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });




// app.delete('/delete_job_posting/:job_id', async (req, res) => {
//   try {
//     const { job_id } = req.params;
//     const uid = await authenticateOdoo();
//     if (!uid) {
//       return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
//     }

//     const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
//     client.methodCall('execute_kw', [db, uid, password, 'hr.job', 'unlink', [[parseInt(job_id)]]], (error, value) => {
//       if (error) {
//         // Handle specific error message indicating record not found or deleted
//         if (error.message.includes("Record does not exist or has been deleted")) {
//           return res.status(404).json({ success: false, error: 'Job posting not found or has been deleted.' });
//         } else {
//           // Handle other errors
//           return res.status(500).json({ success: false, error: error.message });
//         }
//       } else {
//         // Job posting deleted successfully
//         res.status(200).json({ success: true, message: 'Job posting deleted successfully.' });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });



// app.listen(3000, 'localhost', () => {
//     console.log(`Express server running on http://localhost:3000`);
//   });
  
