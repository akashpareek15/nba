const express = require('express');
import { db } from '../db/db.ts';
import { Criteria } from '../models/Criteria.ts';
import { Question } from '../models/Questions.ts';

export const criteriaRoute = express.Router();

// Route for Get All Questions from database
criteriaRoute.get('/', async (request, response) => {
  try {
  
    let collection = await db.collection("criteria");
    const criteria =  await collection.find({}).toArray()
    return response.status(200).json(criteria);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


criteriaRoute.get('/:criteriaId/questions', async (request, response) => {
  try {
    const questions = await db.collection("question").find({ criteriaId: parseInt(request.params.criteriaId) }).toArray();
    return response.status(200).json(questions);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


