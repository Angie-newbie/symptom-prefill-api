import express, { response, request } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { handleError } from '../helpers/errorHelper'; 
import { validateFields } from '../helpers/validationHelper';

const router = express.Router();

// Create  Users
router.post('/register', validateFields(['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'email', 'password']), async (request, response): Promise<any> => {
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

router.post('/login', validateFields(['email', 'password']), async (request, response): Promise<any> => {
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

export default router;
