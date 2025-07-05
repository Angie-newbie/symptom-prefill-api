/** 
Logics:
Handles CRUD operations for medicine records submitted by users (patients) and later updated by doctors.
 - Patients fill in their current medications before meeting a doctor (via POST).
 - Doctors can later review and update these entries after the consultation (via PUT).
**/

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Medicine } from "../models/Medicine";
import { handleError } from '../helpers/errorHelper'; 
import { validateFields } from '../helpers/validationHelper';

const router = express.Router({ mergeParams: true });

// GET all medicines for a user
router.get('/', async (request: Request<{ userId: string }>, response: Response): Promise<any> => {
    const { userId } = request.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const medicines = await Medicine.find({ userId });
        response.status(200).json(medicines);
    } catch (error) {
        handleError(response, 500, 'Error fetching medicines', error);
    }
});


// GET one medicine by ID for a user
router.get('/:id', async (request: Request<{ userId: string, id: string}>, response: Response) : Promise<any> => {
    const { userId, id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ message: 'Invalid user ID or medicine ID' });
    }

    try {
        const medicine = await Medicine.findOne({ _id: id, userId});

        if (!medicine) {
            return response.status(404).json({ message: 'Medicine not found' });
        }

        return response.status(200).json(medicine);
    } catch (error) {
        handleError(response, 400, 'Error fetching medicine', error);
    }
});

// POST: Create medicine (submitted by patient or doctor)
router.post('/create', validateFields(['name', 'dosage', 'frequency']), async (request, response) : Promise<any> => {
    const { userId } = request.params;
    const { name, dosage, frequency, startDate, endDate, notes, submittedBy = 'patient' } = request.body;
    try {
        const {
            name,
            dosage,
            frequency,
            startDate,
            endDate,
            notes,
            // default to patient
            submittedBy = 'patient',
        } = request.body;

        
        // Basic validation
        if (!name || !dosage || !frequency) {
        return response.status(400).json({ message: 'Name, dosage, and frequency are required' });
        }

        const newMedicine = new Medicine({
            userId: request.params.userId,
            name,
            dosage,
            frequency,
            startDate,
            endDate,
            notes,
            submittedBy,
            updatedByDoctor: submittedBy === 'doctor',
        });

        const saved = await newMedicine.save();
        return response.status(201).json(saved);
    } catch (error) {
        handleError(response, 400, 'Failed to save medicine', error);
    }
});

// PUT: Update existing medicine (e.g., by doctor after appointment)
router.put('/:id', async (request: Request<{ userId: string, id: string}>, response: Response): Promise<any> => {
    const { userId, id } = request.params;
    const { name, dosage, frequency, startDate, endDate, notes, updatedByDoctor = true } = request.body;
    try {
        const {
            name,
            dosage,
            frequency,
            startDate,
            endDate,
            notes,
            updatedByDoctor = true,
        } = request.body;

        const updated = await Medicine.findOneAndUpdate(
        { _id: request.params.id, userId: request.params.userId },
        {
            name,
            dosage,
            frequency,
            startDate,
            endDate,
            notes,
            updatedByDoctor,
        }, { new: true, runValidators: true }
        );

        if (!updated) {
            return response.status(404).json({ message: 'Medicine not found' });
        }

        response.status(200).json(updated);
    } catch (error) {
        handleError(response, 400, 'Failed to update medicine', error);
    }
});

// DELETE a medicine
router.delete('/:id', async (request: Request<{ userId: string, id: string}>, response: Response) : Promise<any> => {
    const { userId, id } = request.params;
    try {
    const deleted = await Medicine.findOneAndDelete({
        _id: request.params.id,
        userId: request.params.userId,
    });

    if (!deleted) {
        return response.status(404).json({ message: 'Medicine not found' });
    }

    response.status(200).json({ message: 'Medicine deleted', id: request.params.id });
    } catch (error) {
        handleError(response, 400, 'Failed to delete medicine', error);
    }
});

export default router;
