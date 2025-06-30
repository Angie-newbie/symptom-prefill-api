import express, { Request, Response } from "express"
import { Symptom } from "../models/Symptom";


const router = express.Router();


// Get all symptoms (for a user)
router.get('/user/:userId', async (request, response) => {
    try {
        const symptoms = await Symptom.find();
        response.status(200).json(symptoms);
    } catch (error) {
        response.status(500).json({ message: 'Error fetching symptoms', error });
    }
});

// Get one
router.get('/user/:userId/:id', async (request, response)=>{
    try {
        const symptom = await Symptom.findById(request.params.id);
    if (!symptom) return response.status(404).json({ message: 'Symptom not found' });
        response.status(200).json(symptom);
    } catch (error) {
        response.status(400).json({ message: 'Invalid ID or error', error });
    }
});

// Create  Symptoms
router.post('/user/:userId/create', async (request, response) => {
    try{
        const {name, duration, severity, notes} = request.body;

        // Create new symptom from data
        const newSymptom = new Symptom({userId:request.params.userId, name, duration, severity, notes});

        //Save
        const savedSymptom = await newSymptom.save();

        response.status(201).json(savedSymptom);
    } catch (error) {
        response.status(400).json({message: 'Fail to save syptom', error});
    }
});

// UPDATE a symptom by ID
router.put('/user/:userId/:id', async (request, response) => {
    try {
        const { name, duration, severity, notes } = request.body;
        const updated = await Symptom.findByIdAndUpdate(
            { _id: request.params.id, userId: request.params.userId },
            { name, duration, severity, notes },
            { new: true, runValidators: true }
        );

        if (!updated) return response.status(404).json({ message: 'Symptom not found' });
        response.status(200).json(updated);

    } catch (error) {
        response.status(400).json({ message: 'Failed to update', error });
  }
});

// DELETE a symptom by ID
router.delete('/user/:userId/:id', async (request, response) => {
    try {
        const deleted = await Symptom.findByIdAndDelete( _id: req.params.id, userId: req.params.userId );

        if (!deleted) return response.status(404).json({ message: 'Symptom not found' });
        response.status(200).json({ message: 'Symptom deleted', id: request.params.id });

    } catch (error) {
        response.status(400).json({ message: 'Failed to delete', error });
    }
});

export default router;