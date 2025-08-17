// netlify/functions/mongo.js
const { MongoClient } = require("mongodb");

let client;
let db;

const uri = process.env.MONGO_URI; // Netlify env variable

async function connectToDB() {
  if (db) return { client, db };

  client = new MongoClient(uri);
  await client.connect();
  db = client.db("feshlo"); // change DB name if needed
  return { client, db };
}

module.exports = { connectToDB };
