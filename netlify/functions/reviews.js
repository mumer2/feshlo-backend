import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let cachedClient = null;

export async function handler(event) {
  try {
    // Connect to MongoDB only once
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }
    const db = cachedClient.db("feshlo");
    const collection = db.collection("reviews");

    if (event.httpMethod === "POST") {
      const { name, text } = JSON.parse(event.body);
      if (!name || !text) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };
      }
      const newReview = { name, text, date: new Date() };
      await collection.insertOne(newReview);
      return { statusCode: 200, body: JSON.stringify({ success: true, review: newReview }) };
    }

    if (event.httpMethod === "GET") {
      const reviews = await collection.find().sort({ date: -1 }).toArray();
      return { statusCode: 200, body: JSON.stringify(reviews) };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
