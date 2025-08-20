const connectToDatabase = require("./mongo");

exports.handler = async () => {
  try {
    const client = await connectToDatabase();
    const db = client.db("feshlo"); // choose your DB name
    const products = await db.collection("products").find().toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
