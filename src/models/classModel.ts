// import mongoose, { Schema, Document } from 'mongoose';

// export interface IClass extends Document {
//   trainer: mongoose.Schema.Types.ObjectId;
//   date: Date;
//   startTime: string;
//   trainees: mongoose.Schema.Types.ObjectId[];
// }

// const ClassSchema: Schema = new Schema({
//   trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   date: { type: Date, required: true },
//   startTime: { type: String, required: true },
//   trainees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
// });

// export const Class = mongoose.model<IClass>('Class', ClassSchema);

import mongoose, { Schema, Document } from 'mongoose';

interface IClass extends Document {
  trainer: mongoose.Types.ObjectId; // Reference to Trainer
  trainees: mongoose.Types.ObjectId[]; // Array of trainee IDs
  scheduleTime: Date;
  // Other class properties...
}

const ClassSchema: Schema = new Schema({
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  trainees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trainee' }],  // Ensure this is an array of ObjectId
  scheduleTime: { type: Date, required: true },
  // Other fields...
});

export const Class = mongoose.model<IClass>('Class', ClassSchema);

