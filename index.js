import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

import userRoute from './Routes/UserRoute.js';


configDotenv()

mongoose.connect(process.env.MONGOSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const app = express()

// Apply middleware
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  }));
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())




app.use('/api/', userRoute)                                                                                                 


app.listen(process.env.PORT, () => {
    console.log(`server running on ${process.env.PORT}`);
})