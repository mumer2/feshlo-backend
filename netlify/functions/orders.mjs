// netlify/functions/orders.mjs
import { connectToDB } from "./mongo.mjs";

export async function handler(event, context) {
  try {
    const { db } = await connectToDB();

    // Example: insert into "orders"
    const body = JSON.parse(event.body);
    const result = await db.collection("orders").insertOne(body);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, insertedId: result.insertedId }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
}
