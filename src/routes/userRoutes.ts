import express, { Request, Response, Router} from "express"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "../models/User";

const router = express.Router();

// Get all users
router.get('/', async (request, response) => {
    try {
        const users = await User.find();
        response.status(200).json(users);
    } catch (error) {
        response.status(500).json({ message: 'Error fetching users', error });
    }
});

// Get one
router.get('/:id', authenticate, async (request, response)=>{
    try {
        const user = await User.findById(request.params.id);
    if (!user) return response.status(404).json({ message: 'User not found' });
        response.status(200).json(user);
    } catch (error) {
        response.status(400).json({ message: 'Invalid ID or error', error });
    }
});

// Create  Users
router.post('/register', async (request, response) => {
    try{
        const {firstName ,lastName, dateOfBirth, phoneNumber, email, password} = request.body;

        // if exsited
        const userExsited = await User.findOne({email});
        if (userExsited) return response.status(409).json({message:'Email already registered'})

        // Create new user from data
        const newUser = new User({firstName ,lastName, dateOfBirth, phoneNumber, email, password });

        //Save
        const savedUser = await newUser.save();

        response.status(201).json({message: 'User registered successfully', userId: newUser._id});
    } catch (error) {
        response.status(400).json({message: 'Fail to save user', error});
    }
});

router.post('/login', async (request, response) => {
    const { email, password } = request.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return response.status(404).json({ message: 'User not found' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return response.status(401).json({ message: 'Invalid credentials' });

        // Create JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'dev-secret',
            { expiresIn: '1d' }
        );

        response.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        response.status(500).json({ message: 'Login failed', error });
  }
});

// UPDATE a user by ID
router.put('/:id', async (request, response) => {
    try {
        const { firstName ,lastName, dateOfBirth, phoneNumber} = request.body;
        const updated = await User.findByIdAndUpdate(
            request.params.id,
            { firstName ,lastName, dateOfBirth, phoneNumber},
            { new: true, runValidators: true }
        );

        if (!updated) return response.status(404).json({ message: 'User not found' });
        response.status(200).json(updated);

    } catch (error) {
        response.status(400).json({ message: 'Failed to update', error });
  }
});

// DELETE a user by ID
router.delete('/:id', async (request, response) => {
    try {
        const deleted = await User.findByIdAndDelete(request.params.id);

        if (!deleted) return response.status(404).json({ message: 'User not found' });
        response.status(200).json({ message: 'User deleted', id: request.params.id });

    } catch (error) {
        response.status(400).json({ message: 'Failed to delete', error });
    }
});

export default router;