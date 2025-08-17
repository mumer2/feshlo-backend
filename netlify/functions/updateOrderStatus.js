// netlify/functions/updateOrderStatus.js
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { orderId, status } = JSON.parse(event.body);

    if (!orderId || !status) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing orderId or status" }) };
    }

    await client.connect();
    const db = client.db("feshlo"); // make sure your DB name matches
    const orders = db.collection("orders");

    const result = await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    );

    if (result.modifiedCount === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: "Order not found" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to update status" }) };
  } finally {
    await client.close();
  }
};
