// const express = require('express');
// const xmlrpc = require('xmlrpc');

// const app = express();
// const port = 3000;

// // Odoo instance details
// const url = '20.164.146.60';
// const db = 'bitnami_odoo';
// const username = 'user@example.com';
// const password = 'FKOF4pOJIV';

// // Function to authenticate with Odoo
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

// // Middleware to parse JSON requests
// app.use(express.json());


// // {
// //   "application_data": {
// //       "job_id": 29,
// //       "applicant_name": "Valencia ",
// //       "email": "vale@example.com",
// //       "cover_letter": "I am excited to apply for this position..."
// //   }
// // }


// app.post('/add_application', async (req, res) => {
//   try {
//     const uid = await authenticateOdoo();
//     if (!uid) {
//       return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
//     }

//     const { application_data } = req.body;
//     if (!application_data) {
//       return res.status(400).json({ success: false, error: 'Invalid request data.' });
//     }

//     const { job_id, applicant_name, email, cover_letter } = application_data;
//     if (!job_id || !applicant_name || !email) {
//       return res.status(400).json({ success: false, error: 'Missing required fields in request data.' });
//     }

//     const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
//     client.methodCall('execute_kw', [db, uid, password, 'hr.applicant', 'create', [{
//       'job_id': job_id,
//       'name': applicant_name,
//       'email_from': email,
//       'description': cover_letter
//     }]], (error, value) => {
//       if (error) {
//         res.status(500).json({ success: false, error: error.message });
//       } else {
//         res.status(200).json({ success: true, application_id: value });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// // {
// //     "applicant_id": 6, 
// //     "stage_id": 5 
// //   }
  
  
// // Endpoint to move an applicant to another stage
// app.put('/api/v1/hr/applicant/move_to_stage', async (req, res) => {
//   try {
//     const uid = await authenticateOdoo();
//     if (!uid) {
//       return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
//     }

//     const { applicant_id, stage_id } = req.body;
//     if (!applicant_id || !stage_id) {
//       return res.status(400).json({ success: false, error: 'Invalid request data. Both applicant_id and stage_id are required.' });
//     }

//     const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });
//     client.methodCall('execute_kw', [db, uid, password, 'hr.applicant', 'write', [[applicant_id], { 'stage_id': stage_id }]], (error, value) => {
//       if (error) {
//         res.status(500).json({ success: false, error: error.message });
//       } else {
//         res.status(200).json({ success: true });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Start the Express server
// app.listen(port, () => {
//   console.log(`Express server running on http://localhost:${port}`);
// });
