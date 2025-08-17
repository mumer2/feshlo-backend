const { MongoClient } = require("mongodb");

let client = null;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    if (!data || !data.cart || !data.total) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid order data" }),
      };
    }

    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("feshlo");
    const collection = db.collection("orders");

    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        orderId: result.insertedId,
      }),
    };
  } catch (err) {
    console.error("Error placing order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to place order" }),
    };
  }
};
