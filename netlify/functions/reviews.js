const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // Your MongoDB URI in Netlify environment
const client = new MongoClient(uri);

exports.handler = async (event) => {
  try {
    await client.connect();
    const db = client.db("feshlo"); // Replace with your DB name
    const collection = db.collection("reviews");

    if (event.httpMethod === "POST") {
      // Add a new review
      const { name, comment } = JSON.parse(event.body);
      if (!name || !comment) {
        return { statusCode: 400, body: "Name and comment required" };
      }
      const result = await collection.insertOne({ name, comment, createdAt: new Date() });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.ops[0] }),
      };
    }

    // GET: fetch all reviews
    const reviews = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviews),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.close();
  }
};
