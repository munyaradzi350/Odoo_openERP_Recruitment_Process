const express = require('express');
const router = express.Router();
const { createJobPosting, getJobPostings, getJobPosting, updateJobPosting, deleteJobPosting } = require('../controllers/jobController');

router.post('/create_job_posting', createJobPosting);
router.get('/get_job_postings', getJobPostings);
router.get('/get_job_posting/:job_id', getJobPosting);
router.put('/update_job_posting/:job_id', updateJobPosting);
router.delete('/delete_job_posting/:job_id', deleteJobPosting);


module.exports = router;