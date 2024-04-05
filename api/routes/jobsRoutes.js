const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// GET all jobs
router.get('/', jobController.getAllJobs);

// GET a single job by ID
router.get('/:id', jobController.getJobById);

// POST a new job
router.post('/', jobController.createJob);

// DELETE a job by ID
router.delete('/:id', jobController.deleteJob);

// PUT (update) a job by ID
router.put('/:id', jobController.updateJob);


module.exports = router;
