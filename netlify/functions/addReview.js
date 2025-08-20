const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, comment } = JSON.parse(event.body);

    if (!name || !comment) {
      return { statusCode: 400, body: "Name and comment required" };
    }

    await client.connect();
    const db = client.db("feshlo");          // replace with your DB name
    const collection = db.collection("reviews");

    const review = { name, comment, createdAt: new Date() };
    const result = await collection.insertOne(review);

    return {
      statusCode: 200,
      body: JSON.stringify({ ...review, _id: result.insertedId }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.close();
  }
};
