import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

// Presave: run before the user document is saved
userSchema.pre("save", async function (next) {
    // skip hashing when the password does not changed
    if (!this.isModified("password")) return next();
    // if the password is new or changed
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);