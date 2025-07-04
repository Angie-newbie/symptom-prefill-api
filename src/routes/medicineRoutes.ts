/** 
Logics:
Handles CRUD operations for medicine records submitted by users (patients) and later updated by doctors.
 - Patients fill in their current medications before meeting a doctor (via POST).
 - Doctors can later review and update these entries after the consultation (via PUT).
**/

import express, { Request, Response } from "express";
import { Medicine } from "../models/Medicine";

const router = express.Router();

// GET all medicines for a user
router.get('/:userId/medicines', async (request, response): Promise<any> => {
    try {
        const medicines = await Medicine.find({ userId: request.params.userId });
        response.status(200).json(medicines);
    } catch (error) {
        response.status(500).json({ message: 'Error fetching medicines', error });
    }
});


// GET one medicine by ID for a user
router.get('/:userId/medicines/:id', async (request, response) : Promise<any> => {
    try {
        const medicine = await Medicine.findOne({
            _id: request.params.id,
            userId: request.params.userId,
        });

        if (!medicine) {
            return response.status(404).json({ message: 'Medicine not found' });
        }

        return response.status(200).json(medicine);
    } catch (error) {
        return response.status(400).json({ message: 'Invalid ID or error', error });
    }
});

// POST: Create medicine (submitted by patient or doctor)
router.post('/:userId/medicines', async (request, response) : Promise<any> => {
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
        return response.status(400).json({ message: 'Failed to save medicine', error });
    }
});

// PUT: Update existing medicine (e.g., by doctor after appointment)
router.put('/:userId/medicines/:id', async (request, response) : Promise<any> => {
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
        response.status(400).json({ message: 'Failed to update medicine', error });
    }
});

// DELETE a medicine
router.delete('/:userId/medicines/:id', async (request, response) : Promise<any> => {
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
        response.status(400).json({ message: 'Failed to delete medicine', error });
    }
});

export default router;
