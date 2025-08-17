const { MongoClient } = require("mongodb");

let client;
let db;

const uri = process.env.MONGO_URI; // set in Netlify env vars

async function connectToDB() {
  if (db) return { client, db };

  if (!uri) {
    throw new Error("MONGO_URI is not set in environment variables.");
  }

  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  db = client.db("feshlo"); // database name
  return { client, db };
}

module.exports = { connectToDB };
