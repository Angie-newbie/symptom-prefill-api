import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import symptomRoutes from './routes/symptomRoutes';
import userRoutes from './routes/userRoutes';
import medicineRoutes from './routes/medicineRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/symptoms';

app.use(express.json());

// for heath check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/symptoms', symptomRoutes);
app.use('/users', userRoutes);
app.use('/users/:userId/medicines', medicineRoutes);


app.get('/', (req, res) => {
  res.send('The form is running');
});

export default app;