import express, { Request, Response } from "express"
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
router.get('/:id', async (request, response)=>{
    try {
        const user = await User.findById(request.params.id);
    if (!user) return response.status(404).json({ message: 'User not found' });
        response.status(200).json(user);
    } catch (error) {
        response.status(400).json({ message: 'Invalid ID or error', error });
    }
});

// Create  Users
router.post('/create', async (request, response) => {
    try{
        const {firstName ,lastName, dateOfBirth, phoneNumber} = request.body;

        // Create new user from data
        const newUser = new User({firstName ,lastName, dateOfBirth, phoneNumber});

        //Save
        const savedUser = await newUser.save();

        response.status(201).json(savedUser);
    } catch (error) {
        response.status(400).json({message: 'Fail to save user', error});
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