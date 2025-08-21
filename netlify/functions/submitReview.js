// netlify/functions/submitReview.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI; // MongoDB connection string
const client = new MongoClient(uri);

export async function handler(event) {
  if (event.httpMethod === "POST") {
    try {
      const { name, text } = JSON.parse(event.body);
      await client.connect();
      const db = client.db("feshlo");
      const collection = db.collection("reviews");

      const newReview = { name, text, date: new Date() };
      const result = await collection.insertOne(newReview);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, review: newReview }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: err.message }),
      };
    }
  }

  if (event.httpMethod === "GET") {
    try {
      await client.connect();
      const db = client.db("feshlo");
      const collection = db.collection("reviews");

      const reviews = await collection.find().sort({ date: -1 }).toArray();

      return {
        statusCode: 200,
        body: JSON.stringify(reviews),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  return { statusCode: 405, body: "Method Not Allowed" };
}
