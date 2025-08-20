const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

exports.handler = async () => {
  try {
    await client.connect();
    const db = client.db("feshlo");
    const collection = db.collection("reviews");

    const reviews = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

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
