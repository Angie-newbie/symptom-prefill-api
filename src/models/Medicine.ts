import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },

  startDate: { type: Date },
  endDate: { type: Date },

  notes: { type: String },

  submittedBy: {
    type: String,
    enum: ['patient', 'doctor'],
    required: true,
    default: 'patient'
  },

  updatedByDoctor: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export const Medicine = mongoose.model('Medicine', medicineSchema);