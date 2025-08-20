const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // store in Netlify env variables
const client = new MongoClient(uri);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, comment } = JSON.parse(event.body);

    if (!name || !comment) {
      return { statusCode: 400, body: "Name and comment are required" };
    }

    await client.connect();
    const db = client.db("feshlo");
    const collection = db.collection("reviews");

    const review = { name, comment, createdAt: new Date() };
    await collection.insertOne(review);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Review added", review }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};
