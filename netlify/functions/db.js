// netlify/functions/mongo.js
const { MongoClient } = require("mongodb");

let client;
let db;

async function connectToDB() {
  if (db) return db;

  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db("feshlo"); // ✅ explicitly use "feshlo"
  return db;
}

module.exports = { connectToDB };
