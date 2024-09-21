const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.createTrainerProfile = async function (req, res) {
    const { name, email, password,bio } = req.body;
  
    try {
      // Ensure only admins can create trainer profiles
      if (req.user.role !== 'Admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied. Only admins can create trainer profiles.",
        });
      }
  
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new trainer instance (role is "Trainer")
      const newTrainer = new User({
        name,
        email,
        bio,
        password: hashedPassword,
        role: "Trainer",  // Ensure the role is set to Trainer
      });
  
      // Save the new trainer profile
      const savedTrainer = await newTrainer.save();
  
      res.status(201).json({
        success: true,
        message: "Trainer profile created successfully",
        trainer: savedTrainer,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error creating trainer profile",
        errorDetails: err.message,
      });
    }
  };

exports.getAllTrainers = async function (req, res) {
    try {
      // Ensure only admin can access
      if (req.user.role !== 'Admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access.You must be an admin to perform this action.",
        });
      }
  
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
    const { name, email,bio, password } = req.body;
    const trainerId = req.params.id; // Trainer ID is passed as a URL parameter
  
    try {
      // Ensure only admin can access
      if (req.user.role !== 'Admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access.You must be an admin to perform this action.",
        });
      }
  
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
      if (bio) {
        trainer.bio = bio;
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
      // Ensure only admin can access
      if (req.user.role !== 'Admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access.You must be an admin to perform this action.",
        });
      }
  
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
