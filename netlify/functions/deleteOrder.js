// netlify/functions/deleteOrder.js
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  console.log("👉 Incoming request:", event);

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
    return { statusCode: 405, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { orderId } = JSON.parse(event.body || "{}");

    if (!orderId) {
      return { statusCode: 400, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "Missing orderId" }) };
    }

    await client.connect();
    const db = client.db("feshlo");
    const orders = db.collection("orders");

    const result = await orders.deleteOne({ _id: new ObjectId(orderId) });

    if (result.deletedCount === 0) {
      return { statusCode: 404, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "Order not found" }) };
    }

    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Failed to delete order:", err);
    return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "Failed to delete order" }) };
  }
};
