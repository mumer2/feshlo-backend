const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // put this in Netlify environment variables
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const orderData = JSON.parse(event.body);

    if (!orderData || Object.keys(orderData).length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid order data" }),
      };
    }

    await client.connect();
    const db = client.db("feshlo");
    const orders = db.collection("orders");

    const result = await orders.insertOne(orderData);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: result.insertedId }),
    };
  } catch (error) {
    console.error("Error inserting order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to insert order" }),
    };
  } finally {
    await client.close();
  }
};
