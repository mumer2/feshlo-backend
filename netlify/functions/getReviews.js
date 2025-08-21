const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async () => {
  try {
    await client.connect();
    const db = client.db("feshlo");
    const collection = db.collection("reviews");

    const reviews = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviews),
    };
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to fetch reviews" }),
    };
  } finally {
    await client.close();
  }
};
