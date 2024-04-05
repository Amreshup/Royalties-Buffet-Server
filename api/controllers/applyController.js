const Apply = require('../models/Apply');

exports.getAllApply = async (req, res) => {
  try {
    const applications = await Apply.find();
    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getApplyById = async (req, res) => {
  try {
    const application = await Apply.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Error fetching job application by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createApply = async (req, res) => {
  try {
    const { name, email, phone, position } = req.body;
    const newApplication = new Apply({
      name,
      email,
      phone,
      position
    });
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error('Error creating job application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a job application by ID
exports.deleteApply = async (req, res) => {
  try {
    // Extract the ID of the job application to be deleted from the request parameters
    const { id } = req.params;

    // Find the job application by ID and delete it
    const deletedApply = await Apply.findByIdAndDelete(id);

    // Check if the job application exists
    if (!deletedApply) {
      // If the job application doesn't exist, return a 404 status code
      return res.status(404).json({ error: 'Job application not found' });
    }

    // If the job application is successfully deleted, return a success response
    res.status(200).json({ message: 'Job application deleted successfully' });
  } catch (error) {
    // If an error occurs during deletion, return a 500 status code and the error message
    console.error('Error deleting job application:', error);
    res.status(500).json({ error: 'Failed to delete job application' });
  }
};

exports.updateApply = async (req, res) => {
  try {
    const { name, email, phone, resume, position } = req.body;
    const application = await Apply.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    application.name = name;
    application.email = email;
    application.phone = phone;
    application.resume = resume;
    application.position = position;
    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating job application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
