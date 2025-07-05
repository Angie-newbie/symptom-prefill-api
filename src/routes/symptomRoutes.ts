import express,  { Request, Response } from "express"
import { Symptom } from "../models/Symptom";
import mongoose from 'mongoose';
import { handleError } from '../helpers/errorHelper'; 
import { validateFields } from '../helpers/validationHelper';
import { authenticate } from '../middleware/auth';


const router = express.Router();

// Get all symptoms (for a user)
router.get('/:userId/symptoms', authenticate, async (request, response) => {
    try {
        const { userId } = request.params;
        const symptoms = await Symptom.find({ userId });
        response.status(200).json(symptoms);
    } catch (error) {
        handleError(response, 500, 'Eoor fetching symptoms', error);
    }
});

// Get single symptoms for a user
router.get('/:userId/symptoms/:id', authenticate, async (request, response): Promise<any>  => {
    const { userId, id } = request.params;
    try {
        const symptom = await Symptom.findById({_id: id, userId});
        if (!symptom) return response.status(404).json({ message: 'Symptom not found' });
        response.status(200).json(symptom);
    } catch (error) {
        handleError(response, 400, 'Invalid ID or error', error);
    }
}
);

// Create  Symptoms
router.post('/:userId/symptoms/create', authenticate, validateFields(['name', 'duration', 'severity']), async (request, response) : Promise<any> => {
    const { userId } = request.params;
    const {name, duration, severity, notes} = request.body;

    try{
        // Validate required fields
        if (!name || !duration || !severity) {
            return response.status(400).json({ message: 'Name, duration, and severity are required.' });
        }

        // Create new symptom from data
        const newSymptom = new Symptom({userId, name, duration, severity, notes});

        //Save
        const savedSymptom = await newSymptom.save();

        response.status(201).json(savedSymptom);
    } catch (error) {
        handleError(response, 400, 'Fail to save symptom', error);
    }
});

// UPDATE a symptom by ID
router.put('/:userId/symptoms/:id', authenticate, async (request, response): Promise<any> => {
    const { userId, id } = request.params;
    const updateFields = request.body;

  try {
    // Validate: are the IDs valid ObjectIds?
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ message: 'Invalid user ID or symptom ID format.' });
    }

    // Find and update
    const updatedSymptom = await Symptom.findOneAndUpdate(
      { _id: id, userId }, // Ensure symptom belongs to this user
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedSymptom) {
      return response.status(404).json({ message: 'Symptom not found for this user.' });
    }

    return response.status(200).json(updatedSymptom);
  } catch (error) {
    handleError(response, 400, 'Failed to update symptom', error);
  }
});


// DELETE a symptom by ID
router.delete('/:userId/symptoms/:id', authenticate, async (request, response): Promise<any> => {
    const { userId, id } = request.params;
    try {
        const deleted = await Symptom.findOneAndDelete( {_id: id, userId});

        if (!deleted) return response.status(404).json({ message: 'Symptom not found' });
        response.status(200).json({ message: 'Symptom deleted', id});

    } catch (error) {
        handleError(response, 400, 'Failed to delete symptom', error);
    }
});

export default router;