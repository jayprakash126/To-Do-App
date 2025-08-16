import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; 
import todoRoutes from './routes/todoRoutes.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', todoRoutes);

const PORT=5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});