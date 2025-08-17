// netlify/functions/orders.js
const { connectToDB } = require("./db");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const data = JSON.parse(event.body);
    console.log("📦 Incoming order data:", data);

    const db = await connectToDB();
    console.log("✅ Connected to DB");

    const result = await db.collection("orders").insertOne({
      ...data,
      createdAt: new Date(),
    });

    console.log("✅ Order inserted:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order placed successfully",
        orderId: result.insertedId,
      }),
    };
  } catch (err) {
    console.error("❌ Error placing order:", err.message, err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
