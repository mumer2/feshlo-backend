const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { orderId, status } = JSON.parse(event.body);

    if (!orderId || !status) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing orderId or status" }) };
    }

    await client.connect();
    const db = client.db("feshlo");
    const orders = db.collection("orders");

    const result = await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    );

    if (result.modifiedCount === 1) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 404, body: JSON.stringify({ error: "Order not found" }) };
    }
  } catch (err) {
    console.error("❌ Failed to update order:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to update order" }) };
  } finally {
    await client.close();
  }
};
