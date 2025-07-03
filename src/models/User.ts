import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    dateOfBirth: { type: Date, required: true },
    phoneNumber: { type: String, required: true },

    // Auth fields
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {timestamps: true}
);

export const User = mongoose.model('User', userSchema);