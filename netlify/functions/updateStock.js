// netlify/functions/updateStock.js
const { MongoClient, ObjectId } = require("mongodb");

let cachedClient = null;

// Connect to MongoDB
async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGODB_URI; // set in Netlify environment variables
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { productId, quantity } = JSON.parse(event.body);

    if (!productId || !quantity) {
      return { statusCode: 400, body: "Missing productId or quantity" };
    }

    const client = await connectToDatabase();
    const db = client.db("shop"); // replace with your DB name
    const productsCollection = db.collection("products");

    // Atomically decrease stock
    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(productId), stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { returnDocument: "after" } // return updated product
    );

    if (!result.value) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Not enough stock or product not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.value),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
