import express,  { Request, Response } from "express"
import { Symptom } from "../models/Symptom";


const router = express.Router();

// Get all symptoms (for a user)
router.get('/:userId/symptoms', async (request, response) => {
    try {
        const symptoms = await Symptom.find({userId: request.params.userId});
        response.status(200).json(symptoms);
    } catch (error) {
        response.status(500).json({ message: 'Error fetching symptoms', error });
    }
});

// Get one
router.get('/:userId/symptoms/:id', async (request, response): Promise<any>  => {
    try {
        const symptom = await Symptom.findById({_id: request.params.id, userId: request.params.userId});
        if (!symptom) return response.status(404).json({ message: 'Symptom not found' });
        response.status(200).json(symptom);
    } catch (error) {
        response.status(400).json({ message: 'Invalid ID or error', error });
    }
}
);

// Create  Symptoms
router.post('/:userId/symptoms/create', async (request, response) => {
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
router.put('/:userId/symptoms/:id', async (request, response): Promise<any> => {
    try {
        const { name, duration, severity, notes } = request.body;
        const updated = await Symptom.findOneAndUpdate(
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
router.delete('/:userId/symptoms/:id', async (request, response): Promise<any> => {
    try {
        const deleted = await Symptom.findOneAndDelete( {_id: request.params.id, userId: request.params.userId});

        if (!deleted) return response.status(404).json({ message: 'Symptom not found' });
        response.status(200).json({ message: 'Symptom deleted', id: request.params.id });

    } catch (error) {
        response.status(400).json({ message: 'Failed to delete', error });
    }
});

export default router;