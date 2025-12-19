import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import router from './routes/auth.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());    
app.use(cookieParser());
app.use('/api/auth',router) ;

app.listen(PORT, () => {
    connectDB()
  console.log(`Server is running on port ${PORT}`);
});