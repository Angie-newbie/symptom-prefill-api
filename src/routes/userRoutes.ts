import express, { Request, Response, Router} from "express"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "../models/User";
import { handleError } from '../helpers/errorHelper'; 

const router = express.Router();

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