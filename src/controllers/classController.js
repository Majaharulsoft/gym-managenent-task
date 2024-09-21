const mongoose = require("mongoose");
const Class = require("../models/classModel");


exports.createClass = async function (req, res) {
  const { trainerId, date, startTime } = req.body;

  try {
    // Find existing classes on the same date
    const existingClasses = await Class.find({ date });
    if (existingClasses.length >= 5) {
      return res.status(400).json({
        success: false,
        message: "Cannot create more than 5 classes per day",
      });
    }

    // Automatically generate scheduleTime
    const scheduleTime = `${date} ${startTime}:00`;  // Construct the full scheduleTime

    // Create a new class
    const newClass = new Class({
      trainer: trainerId,
      date: date,
      startTime: startTime,
      scheduleTime: scheduleTime // Set the generated scheduleTime
    });

    // Save the new class
    const savedClass = await newClass.save();
    res.status(201).json({
      success: true,
      message: "Class created successfully",
      newClass: savedClass,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating class",
      errorDetails: err.message,
    });
  }
};

exports.classlists = async function (req, res) {
  try {
    // Fetch all classes from the database
    const classes = await Class.find();

    // Check if no classes are found
    if (!classes || classes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No classes found",
      });
    }

    // Return the list of classes
    res.status(200).json({
      success: true,
      message: "Classes retrieved successfully",
      data: classes,
    });
  } catch (err) {
    // Handle any errors during the fetch process
    res.status(500).json({
      success: false,
      message: "Error retrieving classes",
      errorDetails: err.message,
    });
  }
};


exports.updateClass = async function (req, res) {
  const classId = req.params.id;
  const { trainerId, date, startTime, scheduleTime } = req.body;

  try {
    // Validate classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    // Find the class by ID and update it with the new data
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      {
        trainer: trainerId,
        date: date,
        startTime: startTime,
        scheduleTime: scheduleTime, // Update the scheduleTime if provided
      },
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    // Check if class was found and updated
    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Return the updated class
    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (err) {
    // Handle errors during update
    res.status(500).json({
      success: false,
      message: "Error updating class",
      errorDetails: err.message,
    });
  }
};

exports.deleteClass = async function (req, res) {
  const classId = req.params.id;

  try {
    // Validate classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    // Find the class by ID and delete it
    const deletedClass = await Class.findByIdAndDelete(classId);

    // Check if the class was found and deleted
    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Return success response if class was deleted
    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
      deletedClass: deletedClass,
    });
  } catch (err) {
    // Handle errors during deletion
    res.status(500).json({
      success: false,
      message: "Error deleting class",
      errorDetails: err.message,
    });
  }
};

exports.bookClass = async function (req, res) {
  const classId = req.body.classId;
  const userId = req.user ? req.user.userId : null;

  try {
    // Check if classId and userId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Convert to ObjectId only after validation
    const classObjectId = new mongoose.Types.ObjectId(classId);  // Proper ObjectId conversion
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the class by ID
    const selectedClass = await Class.findById(classObjectId);
    if (!selectedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Check if the class is already full (max 10 trainees)
    if (selectedClass.trainees.length >= 10) {
      return res.status(400).json({
        success: false,
        message: "Class schedule is full. Maximum 10 trainees allowed per schedule.",
      });
    }

    // Check if the user has already booked the class
    if (selectedClass.trainees.includes(userObjectId)) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this class",
      });
    }

    // Add the user to the class's trainee list
    selectedClass.trainees.push(userObjectId);

    // Save the updated class
    const savedClass = await selectedClass.save();
    res.status(201).json({
      success: true,
      message: "Class booked successfully",
      selectedClass: savedClass,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error booking class",
      errorDetails: err.message,
    });
  }
};

exports.getBookedClasses = async function (req, res) {
  const userId = req.user ? req.user.userId : null; // Extract userId from authenticated user

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find classes where userId exists in the 'trainees' array
    const bookedClasses = await Class.find({ trainees: userObjectId });

    // Check if any classes are found
    if (!bookedClasses.length) {
      return res.status(404).json({
        success: false,
        message: "No classes found for the user",
      });
    }

    // Return the booked classes
    res.status(200).json({
      success: true,
      message: "Classes retrieved successfully",
      classes: bookedClasses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving booked classes",
      errorDetails: err.message,
    });
  }
};

exports.deleteBookedClass = async function (req, res) {
  const classId = req.body.classId;
  const userId = req.user ? req.user.userId : null; // Get userId from the authenticated user

  try {
    // Validate classId and userId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid class ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Convert to ObjectId
    const classObjectId = new mongoose.Types.ObjectId(classId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the class
    const selectedClass = await Class.findById(classObjectId);
    if (!selectedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Check if the user has booked this class
    if (!selectedClass.trainees.includes(userObjectId)) {
      return res.status(400).json({
        success: false,
        message: "You have not booked this class",
      });
    }

    // Remove the user from the trainees array
    selectedClass.trainees.pull(userObjectId);

    // Save the updated class
    const updatedClass = await selectedClass.save();
    res.status(200).json({
      success: true,
      message: "You have successfully removed yourself from the class",
      updatedClass: updatedClass,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error removing from class",
      errorDetails: err.message,
    });
  }
};

