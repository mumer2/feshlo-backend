import { connectToDB } from "./mongo.mjs";

export async function handler(event, context) {
  try {
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      console.log("📦 Incoming order:", body);

      const { db } = await connectToDB();
      const result = await db.collection("orders").insertOne(body);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, orderId: result.insertedId }),
      };
    }

    if (event.httpMethod === "GET") {
      const { db } = await connectToDB();
      const orders = await db.collection("orders").find().toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(orders),
      };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (error) {
    console.error("❌ Error placing order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
