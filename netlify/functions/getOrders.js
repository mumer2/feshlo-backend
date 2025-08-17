// netlify/functions/getOrders.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK",
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    await client.connect();
    const database = client.db("feshlo");
    const orders = database.collection("orders");

    const allOrders = await orders.find({}).toArray();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(allOrders),
    };
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to fetch orders" }),
    };
  }
}
