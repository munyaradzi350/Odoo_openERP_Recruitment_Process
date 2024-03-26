const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/schedule_interview', interviewController.scheduleInterview);
router.put('/interview/:id', interviewController.updateInterview);
router.delete('/interview/:id', interviewController.cancelInterview);
router.get('/interviews', interviewController.getInterviews);
router.get('/interviews/:id', interviewController.getInterviewById);


module.exports = router;
