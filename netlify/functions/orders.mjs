// netlify/functions/orders.mjs
import { connectToDB } from "./mongo.mjs";

export async function handler(event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body);
    console.log("🛒 Incoming order body:", body);

    const { db } = await connectToDB();

    const result = await db.collection("orders").insertOne(body);
    console.log("✅ Mongo insert result:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, orderId: result.insertedId }),
    };
  } catch (error) {
    console.error("❌ Failed to place order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to place order" }),
    };
  }
}
