import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import symptomRoutes from './routes/symptomRoutes'

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/symptoms';

app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/symptoms', symptomRoutes);

app.get('/', (req,res) => {
    res.send('the form in running');
});

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});