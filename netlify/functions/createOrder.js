const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

let cachedClient = null;

async function connectDB() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

exports.handler = async function (event, context) {
  try {
    const client = await connectDB();
    const db = client.db("feshlo");
    const data = JSON.parse(event.body);

    const result = await db.collection("orders").insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order placed successfully", id: result.insertedId }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error placing order" };
  }
};
