const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // put in Netlify env vars
const client = new MongoClient(uri);
const dbName = "feshlo"; // change to your DB name
const collectionName = "reviews";

exports.handler = async (event) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    if (event.httpMethod === "POST") {
      const { name, comment } = JSON.parse(event.body);
      await collection.insertOne({ name, comment, createdAt: new Date() });
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    if (event.httpMethod === "GET") {
      const reviews = await collection.find().sort({ createdAt: -1 }).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(reviews),
      };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (error) {
    console.error("❌ Review API Error:", error);
    return { statusCode: 500, body: "Server Error" };
  }
};
