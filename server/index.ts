import cors from 'cors';
import express from 'express';
import { PORT } from './config.ts';
import { criteriaRoute } from './routes/criteriaRoute.ts';


import { authRoute } from './routes/authRoute.ts';
import { departmentRoute } from './routes/departmentRoute.ts';
import { documentRoute } from './routes/documentRoute.ts';

require("dotenv")
  .config();


const app = express();
app.use(express.json());
app.use(cors());

app.use('/criteria', criteriaRoute);
app.use('/departments', departmentRoute);
app.use('/auth', authRoute);
app.use('/document', documentRoute);
// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("An unexpected error occurred.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
process.on('unhandledRejection', (error: any) => {
  console.log('unhandledRejection', error.message);
});
app.use(express.urlencoded({
  extended: true
}));