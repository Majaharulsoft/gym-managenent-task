const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.getAllTrainers = async function (req, res) {
  try {
    // Find all users with the role 'Trainer'
    const trainers = await User.find({ role: 'Trainer' });

    // Check if trainers exist
    if (trainers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trainers found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainers retrieved successfully",
      trainers: trainers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving trainers",
      errorDetails: err.message,
    });
  }
};


exports.updateTrainerProfile = async function (req, res) {
    const { name, email, password } = req.body;
    const trainerId = req.params.id; // Trainer ID is passed as a URL parameter
  
    try {
      // Find the trainer by ID
      const trainer = await User.findById(trainerId);
  
      // Check if the trainer exists and has the role of 'Trainer'
      if (!trainer || trainer.role !== "Trainer") {
        return res.status(404).json({
          success: false,
          message: "Trainer not found",
        });
      }
  
      // Update name and email if provided in the request body
      if (name) {
        trainer.name = name;
      }
      if (email) {
        trainer.email = email;
      }
  
      // If the password is provided, hash the new password
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        trainer.password = hashedPassword;
      }
  
      // Save the updated trainer details
      const updatedTrainer = await trainer.save();
  
      res.status(200).json({
        success: true,
        message: "Trainer profile updated successfully",
        trainer: updatedTrainer,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error updating trainer profile",
        errorDetails: err.message,
      });
    }
  };

  exports.deleteTrainerProfile = async function (req, res) {
    const trainerId = req.params.id; // Trainer ID is passed as a URL parameter
  
    try {
      // Find the trainer by ID
      const trainer = await User.findById(trainerId);
  
      // Check if the trainer exists and has the role of 'Trainer'
      if (!trainer || trainer.role !== "Trainer") {
        return res.status(404).json({
          success: false,
          message: "Trainer not found",
        });
      }
  
      // Delete the trainer
      await User.findByIdAndDelete(trainerId);
  
      res.status(200).json({
        success: true,
        message: "Trainer profile deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error deleting trainer profile",
        errorDetails: err.message,
      });
    }
  };
