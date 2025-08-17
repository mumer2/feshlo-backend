// db.js
const { MongoClient } = require("mongodb");

let client;
let db;

const uri = process.env.MONGO_URI; // Set this in Netlify env variables

async function connectToDB() {
  if (db) return db;

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("feshlo"); // your database name
    console.log("✅ Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectToDB };
