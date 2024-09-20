const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const ClassSchema = mongoose.Schema({
  trainer: {
     type: ObjectId,
     ref: 'Trainer',
     required: true
    },
  trainees: [{ type:ObjectId, ref: 'Trainee' }],
    // Array of ObjectId references to Trainee
    
  scheduleTime: {
     type: Date,
      required: true },
  
});

const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
