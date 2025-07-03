import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import symptomRouter from '../routes/symptomRoutes';
import {Symptom} from '../models/Symptom';


const app = express();
app.use(express.json());
app.use('/symptoms', symptomRouter);

describe('Symptom Routes', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_symptoms', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  });

  afterAll(async () => {
    const db = mongoose.connection.db;
    if (db) {
      await db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should respond with 200 on GET /symptoms/:userId/symptoms/:id', async () => {

    const userId = new mongoose.Types.ObjectId(); 
    // Seed a test symptom
    const testSymptom = new Symptom({
      userId,
      name: 'Cough',
      duration: '3 days',
      severity: 'Mild',
      notes: 'Dry cough',
    });

    await testSymptom.save();

    const res = await request(app).get(`/symptoms/123/symptoms/${testSymptom._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Cough');
  });
});