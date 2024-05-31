import express from 'express';
import { PORT, DB_URL } from './config.ts';
import mongoose from 'mongoose';
import { criteriaRoute } from './routes/criteriaRoute.ts';
import cors from 'cors';
import { MongoClient, Db } from "mongodb";
import { departmentRoute } from './routes/departmentRoute.ts';

const app = express();
app.use(express.json());
app.use(cors());

// app.get('/', (request, response) => {
//   console.log(request);
//   return response.status(234).send('Welcome To MERN Stack Tutorial');
// });
app.use('/criteria', criteriaRoute);
app.use('/departments', departmentRoute);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("An unexpected error occurred.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
