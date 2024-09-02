const express = require("express");
import { db } from "../db/db.ts";

export const criteriaRoute = express.Router();

// Route for Get All Questions from database
criteriaRoute.get("/", async (request, response) => {
  try {
    let collection = await db.collection("criteria");
    const criteria = await collection.find({}).toArray();
    return response.status(200).json(criteria);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

criteriaRoute.get(
  "/:criteriaId/keyword-question",
  async (request, response) => {
    try {
      const { criteriaId } = request.params;
      const criteriaQuestionsCollection = await db.collection(
        "criteria_question"
      );
      let criteriaQuestions = await criteriaQuestionsCollection
        .find({ criteriaId: parseInt(criteriaId) })
        .toArray();

      criteriaQuestions = flattenSubQuestion(criteriaQuestions);

      const collection = await db.collection("question");

      const question = await collection.find({ hasKeywords: true }).toArray();

      const questionFiltered = question.filter((x) =>
        criteriaQuestions.includes(x.questionId)
      );
      return response.status(200).json(questionFiltered);
    } catch (error) {
      response.status(500).send({ message: error.message });
    }
  }
);

const flattenSubQuestion = (questions: any[]) => {
  const flattened = questions.flatMap((q) => {
    const { subQuestions, ...rest } = q;
    return subQuestions ? [rest, ...subQuestions] : rest;
  });

  const isFlattenedReq = flattened.some((x) => x.subQuestions);

  return isFlattenedReq
    ? flattenSubQuestion(flattened)
    : flattened.map((m) => m.questionId);
};

// Route for Get All Questions from database
criteriaRoute.get("/:departmentId", async (request, response) => {
  try {
    const { departmentId } = request.params;

    const answers: any[] = await db
      .collection("answer")
      .find({ departmentId: parseInt(departmentId) })
      .toArray();

    let collection = await db.collection("criteria");
    const criteria = await collection.find({}).toArray();
    return response.status(200).json(
      criteria.map((m) => ({
        ...m,
        total: answers.find((x) => x.criteriaId === m.criteriaId)?.total,
      }))
    );
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

criteriaRoute.get(
  "/:criteriaId/departments/:departmentId/questions",
  async (request, response) => {
    try {
      const { departmentId, criteriaId } = request.params;
      const savedAnswers = await db.collection("answer").findOne({
        criteriaId: parseInt(criteriaId),
        departmentId: parseInt(departmentId),
      });
      const questions = await db.collection("question").find({}).toArray();
      const keywords = await db.collection("keyword").find({}).toArray();
      const criteriaQuestions = await db
        .collection("criteria_question")
        .find({ criteriaId: parseInt(criteriaId) })
        .toArray();
      return response
        .status(200)
        .json({ questions, savedAnswers, keywords, criteriaQuestions });
    } catch (error) {
      response.status(500).send({ message: error.message });
    }
  }
);

criteriaRoute.post(
  "/:criteriaId/departments/:departmentId",
  async (request, response) => {
    try {
      const { departmentId, criteriaId } = request.params;
      const { answers, total } = request.body;
      await db.collection("answer").deleteOne({
        criteriaId: parseInt(criteriaId),
        departmentId: parseInt(departmentId),
      });
      const res = await db.collection("answer").insertOne({
        criteriaId: parseInt(criteriaId),
        departmentId: parseInt(departmentId),
        answers,
        total,
      });
      return response.status(200).json(res);
    } catch (error) {
      response.status(500).send({ message: error.message });
    }
  }
);

criteriaRoute.put("/update-keywords", async (request, response) => {
  try {
    const { keywords, departmentId, questionId } = request.body;

    const questionCollection = await db.collection("keyword_test");
    const question = await questionCollection.findOne({
      questionId: parseInt(questionId),
    });
    const savedKeywords = (question?.keywords ?? []).flat();
    const newKeywords = keywords?.map((x) => x.toLowerCase()) ?? [];
    const keywordsToUpdate = Array.from(
      new Set([...savedKeywords, ...newKeywords])
    );

    const query = { questionId: parseInt(questionId) };
    const update = {
      $set: { questionId: parseInt(questionId), keywords: keywordsToUpdate },
    };
    const options = { upsert: true };
    questionCollection.updateOne(query, update, options);

    return response.status(200).json(keywordsToUpdate);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
