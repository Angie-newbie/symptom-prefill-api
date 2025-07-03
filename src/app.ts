import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import symptomRoutes from './routes/symptomRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/symptoms';

app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/symptoms', symptomRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('The form is running');
});

export default app;