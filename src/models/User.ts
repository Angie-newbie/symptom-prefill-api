import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    dateOfBirth: { type: Date, required: true },
    phoneNumber: { type: String, required: true },
}, {timestamps: true}
);

export const User = mongoose.model('User', userSchema);