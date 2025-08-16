const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // store your Mongo URI in Netlify env variable

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
    const orders = await db.collection("orders").find({}).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error fetching orders" };
  }
};
