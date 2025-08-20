const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // store your MongoDB URI in Netlify Environment Variables

exports.handler = async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("feshlo");
    const collection = db.collection("reviews");

    const reviews = await collection.find().sort({ date: -1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
    };
  } catch (err) {
    return { statusCode: 500, body: "Error fetching reviews" };
  } finally {
    await client.close();
  }
};
