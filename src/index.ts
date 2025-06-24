import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req,res) => {
    res.send('the form in running');
});

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});