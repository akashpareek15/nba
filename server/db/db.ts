import { MongoClient, Db } from "mongodb";
import { DB_URL } from "../config";
const mongoose = require('mongoose')

const client = new MongoClient(DB_URL);


export let db: Db;
client.connect().then((connection) => db = connection.db("nba")).catch(console.log)


export default db;


export const handleDBConnection = (res, onConnect) => mongoose.connect(`${DB_URL}/nba`).then(() => {
    onConnect();
});