// netlify/functions/reviews.js
const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db("feshlo");
  const reviewsCollection = db.collection("reviews");

  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);
    await reviewsCollection.insertOne({
      name: body.name,
      comment: body.comment,
      createdAt: new Date(),
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Review saved!" }),
    };
  }

  if (event.httpMethod === "GET") {
    const reviews = await reviewsCollection.find().sort({ createdAt: -1 }).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
    };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
