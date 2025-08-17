import mongoose from "mongoose";

let conn = null;

const orderSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    note: String,
    cart: Array,
    shippingFee: Number,
    total: Number,
    paymentMethod: String,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    if (!conn) {
      conn = await mongoose.connect(process.env.MONGODB_URI);
    }

    const orders = await Order.find().sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
