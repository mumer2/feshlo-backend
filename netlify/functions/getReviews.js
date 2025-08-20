const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

exports.handler = async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("feshlo");
    const collection = db.collection("reviews");

    const reviews = await collection.find().sort({ date: -1 }).toArray();

    // Convert _id to string for JSON serialization
    const formatted = reviews.map((r) => ({
      id: r._id.toString(),
      name: r.name,
      review: r.review,
      date: r.date,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(formatted),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error fetching reviews" };
  } finally {
    await client.close();
  }
};
