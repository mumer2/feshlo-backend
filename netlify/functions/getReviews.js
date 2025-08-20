// netlify/functions/getReviews.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // Make sure this is set in Netlify env
const client = new MongoClient(uri);

exports.handler = async () => {
  try {
    await client.connect();
    const db = client.db("feshlo");      // Replace with your DB name
    const collection = db.collection("reviews");

    const reviews = await collection
      .find({})
      .sort({ createdAt: -1 })             // newest first
      .toArray();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviews),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    await client.close();
  }
};
