import express,  { Request, Response } from "express"
import { Symptom } from "../models/Symptom";


const router = express.Router();

// Handle errors with consistent formatting
const handleError = (response: Response, statusCode: number, message: string, error: any) => {
  response.status(statusCode).json({ message, error });
};

// Get all symptoms (for a user)
router.get('/:userId/symptoms', async (request, response) => {
    try {
        const { userId } = request.params;
        const symptoms = await Symptom.find({ userId });
        response.status(200).json(symptoms);
    } catch (error) {
        handleError(response, 500, 'Eoor fetching symptoms', error);
    }
});

// Get single symptoms for a user
router.get('/:userId/symptoms/:id', async (request, response): Promise<any>  => {
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
router.post('/:userId/symptoms/create', async (request, response) : Promise<any> => {
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
router.put('/:userId/symptoms/:id', async (request, response): Promise<any> => {
    const { userId, id } = request.params;
    const { name, duration, severity, notes } = request.body;
    try {
        const updated = await Symptom.findOneAndUpdate(
            { _id: id, userId},
            { name, duration, severity, notes },
            { new: true, runValidators: true }
        );

        if (!updated) return response.status(404).json({ message: 'Symptom not found' });
        response.status(200).json(updated);

    } catch (error) {
        handleError(response, 400, 'Failed to update symptom', error);
  }
});

// DELETE a symptom by ID
router.delete('/:userId/symptoms/:id', async (request, response): Promise<any> => {
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