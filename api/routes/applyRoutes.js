const express = require('express');
const router = express.Router();
const applyController = require('../controllers/applyController');

// GET all job applications
router.get('/', applyController.getAllApply);

// GET a single job application by ID
router.get('/:id', applyController.getApplyById);

// POST a new job application
router.post('/', applyController.createApply);

// DELETE a job application by ID
router.delete('/:id', applyController.deleteApply);

// PUT (update) a job application by ID
router.put('/:id', applyController.updateApply);

module.exports = router;
