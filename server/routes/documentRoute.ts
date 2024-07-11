const express = require('express');
const multer = require('multer');
import { ulid } from 'ulid'
const path = require('path');
export const documentRoute = express.Router();
const officeParser = require('officeparser');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: './documents',
    filename: function (req, file, cb) {
        const fileName = ulid();
        return cb(null, `${fileName}${path.extname(file.originalname)}`)
    }
});
// const storage = multer.memoryStorage()

var upload = multer({ storage: storage })
documentRoute.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    try {
        const data = await officeParser.parseOfficeAsync(req.file.path);
        res.send(data);

    } catch (error) {
        console.log(error)
    }
    // res.send(res.req.file.filename);
});



