import { connectToDB } from "./mongo";

export async function handler(event, context) {
  const { method } = event;

  const { db } = await connectToDB();
  const collection = db.collection("orders");

  if (method === "POST") {
    try {
      const data = JSON.parse(event.body);
      const result = await collection.insertOne({ ...data, createdAt: new Date() });
      return {
        statusCode: 201,
        body: JSON.stringify(result.ops[0]),
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  if (method === "GET") {
    try {
      const orders = await collection.find().sort({ createdAt: -1 }).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(orders),
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, body: "Method Not Allowed" };
}
