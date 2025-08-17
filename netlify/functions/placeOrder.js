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

    const db = await connectToDB();
    const result = await db.collection("orders").insertOne({
      ...data,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order placed successfully",
        orderId: result.insertedId,
      }),
    };
  } catch (err) {
    console.error("❌ Error placing order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to place order" }),
    };
  }
};
