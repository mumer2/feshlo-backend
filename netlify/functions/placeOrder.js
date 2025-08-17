// netlify/functions/placeOrder.js
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const order = JSON.parse(event.body);

    if (!order) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid order data" }),
      };
    }

    await client.connect();
    const db = client.db("feshlo"); // ✅ your DB name
    const collection = db.collection("orders"); // ✅ your collection

    const result = await collection.insertOne(order);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ Order placed successfully",
        orderId: result.insertedId,
      }),
    };
  } catch (err) {
    console.error("❌ Backend error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to place order", details: err.message }),
    };
  }
}
