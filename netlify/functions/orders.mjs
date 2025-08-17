const { connectToDB } = require("./mongo.js");

exports.handler = async (event, context) => {
  try {
    const { db } = await connectToDB();
    const body = JSON.parse(event.body);

    const result = await db.collection("orders").insertOne(body);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, insertedId: result.insertedId }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
