import request from 'supertest';
import express from 'express';
import symptomRouter from '../routes/symptomRoutes';


const app = express();
app.use(express.json()); // for parsing application/json
app.use('/api', symptomRouter);

describe('Symptom Routes', () => {
  it('should respond with 200 on GET /api/user/:userId/:id', async () => {
    const userId = '123';
    const symptomId = '456';

    // Here you could mock Symptom.findById or use an actual test DB setup.

    const res = await request(app).get(`/api/user/${userId}/${symptomId}`);

    expect(res.statusCode).toBe(200); // or 404 or whatever your logic is
  });

});