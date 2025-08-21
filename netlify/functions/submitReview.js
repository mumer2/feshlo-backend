const { MongoClient } = require("mongodb");

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST" || !event.body) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "POST request with body required" }),
    };
  }

  try {
    const { author, review } = JSON.parse(event.body);

    if (!author || !review) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing author or review" }),
      };
    }

    await client.connect();
    const db = client.db("feshlo");
    const collection = db.collection("reviews");

    const newReview = {
      author,
      review,
      createdAt: new Date(),
    };

    await collection.insertOne(newReview);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Review submitted successfully!" }),
    };
  } catch (error) {
    console.error("Error submitting review:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to submit review" }),
    };
  } finally {
    await client.close();
  }
};
