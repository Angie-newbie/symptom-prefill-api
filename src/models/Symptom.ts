import mongoose from "mongoose"

const symptomSchema = new mongoose.Schema({
    name: {type: String, required:true},
    duration: {type: String},
    severity: {type: String},
    notes: {type: String}
}, {timestamps: true}
);

export const Symptom = mongoose.model('Symptom', symptomSchema)