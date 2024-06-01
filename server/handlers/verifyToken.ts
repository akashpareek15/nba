const jwt = require("jsonwebtoken");
import { handleDBConnection } from "../db/db";
import { IUser, UserSchema } from "../models/User";

export const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
            if (err) req.user = undefined;

            handleDBConnection(res, () => {
                UserSchema.findOne({
                    _id: decode.id
                })
                    .exec().then((user) => {
                        if (err) {
                            res.status(401)
                                .send({
                                    message: 'Not authorized'
                                });
                        } else {
                            req.user = user;
                            next();
                        }
                    })
            })
        });
    } else {
        res.status(401)
            .send({
                message: 'Not authorized'
            });
    }
};