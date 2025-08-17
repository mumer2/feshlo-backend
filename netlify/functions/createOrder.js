// netlify/functions/createOrder.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // your MongoDB Atlas connection string
const client = new MongoClient(uri);

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

  // Only allow POST for creating orders
  if (event.httpMethod !== "POST") {
    console.log("❌ Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse request body
    const data = JSON.parse(event.body || "{}");
    console.log("📦 Parsed order data:", data);

    // Basic validation
    if (!data || Object.keys(data).length === 0) {
      console.log("❌ Missing order data");
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Order data is required" }),
      };
    }

    // Connect to DB
    await client.connect();
    const database = client.db("feshlo");
    const orders = database.collection("orders");

    // Insert order
    const result = await orders.insertOne({
      ...data,
      createdAt: new Date(),
    });

    console.log("✅ Order inserted:", result.insertedId);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        orderId: result.insertedId,
      }),
    };
  } catch (error) {
    console.error("🔥 Error inserting order:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to place order" }),
    };
  } finally {
    // Don’t close client (cold start reuse)
  }
};
