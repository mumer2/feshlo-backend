// netlify/functions/updateOrderStatus.js
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  console.log("👉 Incoming request:", {
    method: event.httpMethod,
    body: event.body,
  });

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ message: "CORS preflight OK" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { orderId, status } = JSON.parse(event.body || "{}");

    if (!orderId || !status) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing orderId or status" }),
      };
    }

    await client.connect();
    const db = client.db("feshlo");
    const orders = db.collection("orders");

    const result = await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Order not found" }),
      };
    }

    console.log(`✅ Order ${orderId} status updated to "${status}"`);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("🔥 Failed to update status:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to update status" }),
    };
  }
};
