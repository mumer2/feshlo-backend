const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

exports.handler = async (event) => {
  const client = new MongoClient(uri);
  try {
    const { name, review } = JSON.parse(event.body);

    if (!name || !review) return { statusCode: 400, body: "Invalid input" };

    await client.connect();
    const db = client.db("feshlo");
    const collection = db.collection("reviews");

    const newReview = {
      name,
      review,
      date: new Date(),
    };

    const result = await collection.insertOne(newReview);

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: result.insertedId.toString(),
        ...newReview,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error submitting review" };
  } finally {
    await client.close();
  }
};
