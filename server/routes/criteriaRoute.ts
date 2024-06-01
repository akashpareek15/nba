const express = require('express');
import { db } from '../db/db.ts';
import { verifyToken } from '../handlers/verifyToken.ts';

export const criteriaRoute = express.Router();

// Route for Get All Questions from database
criteriaRoute.get('/', async (request, response) => {
  try {

    let collection = await db.collection("criteria");
    const criteria = await collection.find({}).toArray()
    return response.status(200).json(criteria);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


criteriaRoute.get('/:criteriaId/departments/:departmentId/questions', async (request, response) => {
  try {
    const { departmentId, criteriaId } = request.params;
    const answer = await db.collection("answer").findOne({ criteriaId: parseInt(criteriaId), departmentId: parseInt(departmentId) });
    const questions = answer ? answer.questions : await db.collection("question").find({ criteriaId: parseInt(criteriaId) }).toArray();
    return response.status(200).json(questions);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


criteriaRoute.post('/:criteriaId/departments/:departmentId', async (request, response) => {
  try {
    const { departmentId, criteriaId } = request.params;
    const { questions, total } = request.body
    await db.collection("answer").deleteOne({ criteriaId: parseInt(criteriaId), departmentId: parseInt(departmentId) });
    const res = await db.collection("answer").insertOne({ criteriaId: parseInt(criteriaId), departmentId: parseInt(departmentId), questions, total });
    return response.status(200).json(res);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});