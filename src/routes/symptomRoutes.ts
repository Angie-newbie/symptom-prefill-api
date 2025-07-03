import express,  { Request, Response } from "express"
import { Symptom } from "../models/Symptom";

const router = express.Router();

// For routes with both userId and id params
interface UserIdParams  {
  userId: string;
  id: string;
}


// Get all symptoms (for a user)
router.get('/:userId/symptoms', async (req, res) => {
    try {
        const symptoms = await Symptom.find();
        res.status(200).json(symptoms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching symptoms', error });
    }
});

// Get one
router.get('/:userId/symptoms/:id', async (req, res): Promise<any>  => {
    try {
        const symptom = await Symptom.findById(req.params.id);
        if (!symptom) return res.status(404).json({ message: 'Symptom not found' });
        res.status(200).json(symptom);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID or error', error });
    }
}
);

// Create  Symptoms
router.post('/:userId/symptoms/create', async (req, res) => {
    try{
        const {name, duration, severity, notes} = req.body;

        // Create new symptom from data
        const newSymptom = new Symptom({userId:req.params.userId, name, duration, severity, notes});

        //Save
        const savedSymptom = await newSymptom.save();

        res.status(201).json(savedSymptom);
    } catch (error) {
        res.status(400).json({message: 'Fail to save syptom', error});
    }
});

// UPDATE a symptom by ID
router.put('/:userId/symptoms/:id', async (req, res): Promise<any> => {
    try {
        const { name, duration, severity, notes } = req.body;
        const updated = await Symptom.findOneAndUpdate(
            { _id: req.params.id, userId: req.params.userId },
            { name, duration, severity, notes },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: 'Symptom not found' });
        res.status(200).json(updated);

    } catch (error) {
        res.status(400).json({ message: 'Failed to update', error });
  }
});

// DELETE a symptom by ID
router.delete('/:userId/symptoms/:id', async (req, res): Promise<any> => {
    try {
        const deleted = await Symptom.findOneAndDelete( {_id: req.params.id, userId: req.params.userId});

        if (!deleted) return res.status(404).json({ message: 'Symptom not found' });
        res.status(200).json({ message: 'Symptom deleted', id: req.params.id });

    } catch (error) {
        res.status(400).json({ message: 'Failed to delete', error });
    }
});

export default router;