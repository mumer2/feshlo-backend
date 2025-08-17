// netlify/functions/placeOrder.js
const { connectToDB } = require("../../db");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const order = JSON.parse(event.body);

    if (!order.name || !order.email || !order.items) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const db = await connectToDB();
    const result = await db.collection("orders").insertOne({
      ...order,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order placed successfully", id: result.insertedId }),
    };
  } catch (error) {
    console.error("❌ Error placing order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to place order" }),
    };
  }
};
