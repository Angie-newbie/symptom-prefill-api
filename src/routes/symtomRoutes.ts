import express, { response } from "express"
import { Symptom } from "../models/Symptom";
import { request } from "http";

const router = express.Router();

// Create  Symptoms
router.post('/', async (request, response) => {
    try{
        const {name, duration, severity, notes} = request.body;

        // Create new symptom from data
        const newSymptom = new Symptom({name, duration, severity, notes});

        //Save
        const savedSymptom = await newSymptom.save();

        response.status(401).json(savedSymptom);
    } catch (error) {
        response.status(400).json({message: 'Fail to save syptom', error});
    }
});

export default router;