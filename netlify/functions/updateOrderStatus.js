const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

exports.handler = async (event) => {
  try {
    const { orderId, status } = JSON.parse(event.body);
    await client.connect();
    const db = client.db("feshlo");
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    );
    return { statusCode: 200, body: "Order updated" };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  } finally {
    await client.close();
  }
};
