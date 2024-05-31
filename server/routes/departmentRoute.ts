const express = require('express');
import { db } from '../db/db.ts';

export const departmentRoute = express.Router();

departmentRoute.get('/', async (request, response) => {
  try {

    let collection = await db.collection("department");
    const departments = await collection.find({}).toArray()
    return response.status(200).json(departments);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});



