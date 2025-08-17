// netlify/functions/updateOrderStatus.js
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    await client.connect();
    const db = client.db("feshlo");
    const orders = db.collection("orders");

    const { orderId, status } = JSON.parse(event.body);

    if (!orderId || !status) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing orderId or status" }) };
    }

    const result = await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    );

    if (result.modifiedCount === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: "Order not found or status unchanged" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Failed to update status:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
