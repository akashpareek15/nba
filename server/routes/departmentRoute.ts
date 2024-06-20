const express = require('express');
import { db } from '../db/db.ts';

export const departmentRoute = express.Router();

departmentRoute.get('/', async (request, response) => {
  try {

    const collection = await db.collection("department");
    const answers = await db.collection("answer").aggregate([
      {
        $group:
        {
          _id: { departmentId: "$departmentId" },
          total: { $sum: '$total' },
          submittedCriteria: { $sum: 1 },
        }
      }
    ]).toArray();
    
    const criteria = (await db.collection("criteria").find({}).toArray()).length;
    const departments = await collection.find({}).toArray();
    return response.status(200).json(departments.map(m => {
      const answer = answers.find(x => x._id.departmentId === m.departmentId);
      return { ...m, total: answer?.total, submittedCriteria: answer?.submittedCriteria, criteriaCount: criteria }
    }));
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});



