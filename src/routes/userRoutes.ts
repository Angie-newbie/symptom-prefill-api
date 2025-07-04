import express, { Request, Response, Router} from "express"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "../models/User";

const router = express.Router();

// Helper: Consistent error responses
const handleError = (res: Response, status: number, message: string, error: any) => {
  res.status(status).json({ message, error });
};

// Get all users
router.get('/', async (request, response) => {
    try {
        const users = await User.find();
        response.status(200).json(users);
    } catch (error) {
        handleError(response, 500, 'Error fetching users', error);
    }
});

// Get one
router.get('/:id', async (request, response): Promise<any>=>{
    const { id } = request.params;
    try {
        const user = await User.findById(id);
    if (!user) return response.status(404).json({ message: 'User not found' });
        response.status(200).json(user);
    } catch (error) {
        handleError(response, 400, 'Invalid ID or error', error);
    }
});

// Create  Users
router.post('/register', async (request, response): Promise<any> => {
    const {firstName ,lastName, dateOfBirth, phoneNumber, email, password} = request.body;
    try{
        // if exsited
        const userExsited = await User.findOne({email});
        if (userExsited) return response.status(409).json({message:'Email already registered'})

        // Create new user from data
        const newUser = new User({firstName ,lastName, dateOfBirth, phoneNumber, email, password });

        //Save
        await newUser.save();

        response.status(201).json({message: 'User registered successfully', userId: newUser._id});
    } catch (error) {
        handleError(response, 400, 'Failed to save user', error);
    }
});

router.post('/login', async (request, response): Promise<any> => {
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
        console.error('Login error:', error)
        handleError(response, 500, 'Login failed', error);
  }
});

// UPDATE a user by ID
router.put('/:id', async (request, response): Promise<any> => {
    const { id } = request.params;
    const { firstName ,lastName, dateOfBirth, phoneNumber} = request.body;
    try {
        const updated = await User.findByIdAndUpdate(
            request.params.id,
            { firstName ,lastName, dateOfBirth, phoneNumber},
            { new: true, runValidators: true }
        );

        if (!updated) return response.status(404).json({ message: 'User not found' });
        response.status(200).json(updated);

    } catch (error) {
        handleError(response, 400, 'Failed to update user', error);
  }
});

// DELETE a user by ID
router.delete('/:id', async (request, response): Promise<any> => {
    const { id } = request.params;
    try {
        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) return response.status(404).json({ message: 'User not found' });
        response.status(200).json({ message: 'User deleted', id });

    } catch (error) {
        handleError(response, 400, 'Failed to delete user', error);
    }
});

export default router;