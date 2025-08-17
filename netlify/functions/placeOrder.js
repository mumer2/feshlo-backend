const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    await client.connect();
    const db = client.db("feshlo"); // ✅ use your db
    const collection = db.collection("orders");

    const result = await collection.insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ Order placed successfully",
        orderId: result.insertedId,
      }),
    };
  } catch (error) {
    console.error("PlaceOrder error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to place order" }),
    };
  } finally {
    await client.close();
  }
};
