const connectToDatabase = require("./mongo");
const { ObjectId } = require("mongodb");

exports.handler = async (event) => {
  try {
    const { productId, quantity } = JSON.parse(event.body);
    const client = await connectToDatabase();
    const db = client.db("feshlo");

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return { statusCode: 404, body: JSON.stringify({ message: "Product not found" }) };
    }

    if (product.stock < quantity) {
      return { statusCode: 400, body: JSON.stringify({ message: "Not enough stock" }) };
    }

    // Decrease stock
    await db
      .collection("products")
      .updateOne(
        { _id: new ObjectId(productId) },
        { $inc: { stock: -quantity } }
      );

    const updatedProduct = await db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) });

    return { statusCode: 200, body: JSON.stringify(updatedProduct) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
