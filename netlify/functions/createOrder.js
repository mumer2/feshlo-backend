// netlify/functions/createOrder.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // set in Netlify environment variables
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
  console.log("👉 Incoming request:", {
    method: event.httpMethod,
    body: event.body,
  });

  if (event.httpMethod !== "POST") {
    console.log("❌ Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Only POST method allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // Validate input
    if (!data.name || !data.items || !Array.isArray(data.items)) {
      console.log("❌ Validation failed:", data);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid order data" }),
      };
    }

    console.log("✅ Connecting to MongoDB...");
    await client.connect();
    const db = client.db("feshlo");
    const orders = db.collection("orders");

    console.log("📦 Inserting order:", data);
    const result = await orders.insertOne({
      ...data,
      createdAt: new Date(),
    });

    console.log("✅ Order inserted with ID:", result.insertedId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        id: result.insertedId,
      }),
    };
  } catch (err) {
    console.error("❌ Error placing order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to place order", details: err.message }),
    };
  } finally {
    await client.close();
  }
};
