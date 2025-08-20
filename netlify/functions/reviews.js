const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // stored in Netlify environment variables
let client = null;

exports.handler = async (event) => {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  const db = client.db("feshlo");
  const collection = db.collection("reviews");

  if (event.httpMethod === "GET") {
    const reviews = await collection.find({}).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
    };
  }

  if (event.httpMethod === "POST") {
    const data = JSON.parse(event.body);
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }

  return {
    statusCode: 405,
    body: "Method not allowed",
  };
};
