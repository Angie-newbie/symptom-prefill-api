import request from 'supertest';
import app from '../app';

describe('Symptom API', () => {
  it('should respond to GET /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('the form in running');
  });
});