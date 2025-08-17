import { MongoClient } from "mongodb";

let client;
let db;

const uri = process.env.MONGO_URI; // Set in Netlify environment variables

export async function connectToDB() {
  if (db) return { client, db };

  client = new MongoClient(uri);
  await client.connect();
  db = client.db("feshlo"); // your DB name
  return { client, db };
}
