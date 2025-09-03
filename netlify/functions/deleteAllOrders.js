// netlify/functions/deleteAllOrders.js
const { MongoClient } = require("mongodb");

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  cachedDb = client.db("feshlo"); // ✅ replace with your DB name
  return cachedDb;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const db = await connectToDatabase(process.env.MONGO_URI);
    const collection = db.collection("orders");

    const result = await collection.deleteMany({}); // ✅ remove all orders

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "All orders deleted successfully",
        deletedCount: result.deletedCount,
      }),
    };
  } catch (error) {
    console.error("Error deleting all orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to delete all orders" }),
    };
  }
};
