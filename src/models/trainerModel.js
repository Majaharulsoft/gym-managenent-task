const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const TrainerSchema = mongoose.Schema({
  user: {
     type: ObjectId,
      ref: 'User',
      required: true
    },

  specialization: {
     type: String,
     required: true
    },
}, {timestamps:true,versionKey:false}
);

const Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = Trainer;
