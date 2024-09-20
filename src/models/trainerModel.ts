import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainer extends Document {
  user: mongoose.Schema.Types.ObjectId;
  specialization: string;
}

const TrainerSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
});

export const Trainer = mongoose.model<ITrainer>('Trainer', TrainerSchema);
