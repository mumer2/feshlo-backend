import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function handler(event, context) {
  try {
    await client.connect();
    const db = client.db("feshlo");   // your db name
    const collection = db.collection("reviews");

    const reviews = await collection.find({}).sort({ _id: -1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    await client.close();
  }
}
