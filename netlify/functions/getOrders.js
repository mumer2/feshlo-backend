const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // your MongoDB connection string
const client = new MongoClient(uri);

exports.handler = async () => {
  try {
    await client.connect();
    const db = client.db("feshlo");
    const orders = await db.collection("orders").find().sort({ createdAt: -1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  } finally {
    await client.close();
  }
};
