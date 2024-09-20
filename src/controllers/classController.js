const mongoose = require("mongoose");
const Class = require("../models/classModel");

exports.bookClass = function (req, res) {
    const classId = req.body.classId;
    const userId = req.user ? req.user.userId : null; // Access userId from req.user

  try {
    // Convert classId and userId from string to ObjectId
    const classObjectId = mongoose.Types.ObjectId(classId);
    const userObjectId = mongoose.Types.ObjectId(userId);

    Class.findById(classObjectId, function (err, selectedClass) {
      if (err || !selectedClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        });
      }

      // Check if the class is already full
      if (selectedClass.trainees.length >= 10) {
        return res.status(400).json({
          success: false,
          message:
            "Class schedule is full. Maximum 10 trainees allowed per schedule.",
        });
      }

      // Add the trainee (user) to the class schedule
      selectedClass.trainees.push(userObjectId); // Use ObjectId for the trainee

      selectedClass.save(function (err, savedClass) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error booking class",
            errorDetails: err.message,
          });
        }
        res.status(201).json({
          success: true,
          message: "Class booked successfully",
          selectedClass: savedClass,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unknown error occurred.",
    });
  }
};

exports.createClass = function (req, res) {
    const trainerId = req.body.trainerId;
    const date = req.body.date;
    const startTime = req.body.startTime;

  try {
    Class.find({ date: date }, function (err, existingClasses) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error finding classes",
          errorDetails: err.message,
        });
      }

      if (existingClasses.length >= 5) {
        return res.status(400).json({
          success: false,
          message: "Cannot create more than 5 classes per day",
        });
      }

      const newClass = new Class({
        trainer: trainerId,
        date: date,
        startTime: startTime,
      });

      newClass.save(function (err, savedClass) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error creating class",
            errorDetails: err.message,
          });
        }
        res.status(201).json({
          success: true,
          message: "Class created successfully",
          newClass: savedClass,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unknown error occurred.",
    });
  }
};
