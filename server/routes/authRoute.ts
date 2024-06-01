
import { DB_URL } from "../config";
import { handleDBConnection } from "../db/db";
import { IUser, UserSchema } from "../models/User";


const express = require('express');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const mongoose = require('mongoose');
export const authRoute = express.Router();
authRoute.post('/register', async (req, res) => {

    mongoose.connect(`${DB_URL}/nba`).then(() => {
        const user = new UserSchema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role,
            password: bcrypt.hashSync(req.body.password, 8),
            department: req.body.department
        });

        user.save().then(resp => {
            res.status(200).json({ message: 'Registration Successful' });
        }).catch((err) => {
            if (err.code === 11000) {
                res.status(500).json({ message: `${user.email} already registered` })
            }
            res.status(500).json(err)
        }).finally(() => {
            mongoose.connection.close();
        });
    })
});
authRoute.post('/login', async (req, res) => {
    handleDBConnection(res, () => {
        UserSchema.findOne({
            email: req.body.email
        })
            .exec().then((user: IUser) => {
                if (!user) {
                    return res.status(404)
                        .send({
                            message: "User Not found."
                        });
                }
                const { department, email, firstName, lastName, password, role, id } = user;
                const passwordIsValid = bcrypt.compareSync(req.body.password, password);
                if (!passwordIsValid) {
                    return res.status(401)
                        .send({
                            accessToken: null,
                            message: "Invalid Password!"
                        });
                }
                //signing token with user id
                var token = jwt.sign({ id }, process.env.API_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200)
                    .send({
                        user: {
                            department, email, firstName, lastName, role, id
                        },
                        message: "Login successful",
                        accessToken: token,
                    });
            });
    });
});