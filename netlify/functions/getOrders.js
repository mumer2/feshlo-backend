// netlify/functions/getOrders.js
const { connectToDB } = require("../../db");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const db = await connectToDB();
    const orders = await db.collection("orders").find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch orders" }),
    };
  }
};
