const express = require("express");
const multer = require("multer");
import { ulid } from "ulid";
import { db } from "../db/db";
const path = require("path");
export const documentRoute = express.Router();
const officeParser = require("officeparser");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "./documents",
  filename: function (req, file, cb) {
    const fileName = ulid();
    return cb(null, `${fileName}${path.extname(file.originalname)}`);
  },
});
// const  storage =  multer.memoryStorage()

var upload = multer({ storage: storage });
documentRoute.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const { name, ext } = path.parse(req.file.path);
    const { name: originalFileName } = path.parse(req.file.originalname);

    await db.collection("document").insertOne({
      documentId: name,
      fileType: ext.slice(1, ext.length),
      originalFileName,
    });
    const data = await officeParser.parseOfficeAsync(req.file.path);
    res.send({
      parsedData: data,
      documentId: name,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

documentRoute.get("/:documentId/download", async (req, res) => {
  const { documentId } = req.params;

  try {
    var filePath = "./documents/";
    const { fileType } = await db
      .collection("document")
      .findOne({ documentId });

    res.download(filePath + `${documentId}.${fileType}`);
  } catch (error) {
    console.log(error);
  }
});
