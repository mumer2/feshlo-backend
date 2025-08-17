import { MongoClient } from "mongodb";

let client;
let db;

const uri = process.env.MONGO_URI; // Make sure this is set in Netlify

export async function connectToDB() {
  if (db) return { client, db };

  client = new MongoClient(uri); // ✅ clean, no deprecated options
  await client.connect();
  db = client.db("feshlo"); // use your DB name
  return { client, db };
}
