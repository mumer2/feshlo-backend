// netlify/functions/reviews.js
const { MongoClient } = require("mongodb");

let cachedClient = null;

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: "OK",
    };
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await cachedClient.connect();
    }

    const db = cachedClient.db("feshlo");
    const collection = db.collection("reviews");

    // ------------------ POST (add review) ------------------
    if (event.httpMethod === "POST") {
      const { productId, name, text, rating } = JSON.parse(event.body || "{}");

      if (!name || !text || !rating) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Missing name, text, or rating" }),
        };
      }

      const numericRating = Number(rating);
      if (numericRating < 1 || numericRating > 5) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Rating must be between 1 and 5" }),
        };
      }

      const newReview = {
        productId: productId || null, // 🔥 store productId if available
        name,
        text,
        rating: numericRating,
        date: new Date(),
      };

      await collection.insertOne(newReview);

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true, review: newReview }),
      };
    }

    // ------------------ GET (fetch reviews) ------------------
    if (event.httpMethod === "GET") {
      const productId = event.queryStringParameters?.productId;

      let query = {};
      if (productId) {
        query = { productId }; // only that product’s reviews
      }

      const reviews = await collection
        .find(query)
        .sort({ date: -1 })
        .toArray();

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(reviews),
      };
    }


    // ------------------ DELETE (remove review) ------------------
if (event.httpMethod === "DELETE") {
  const { id, all } = event.queryStringParameters;

  if (all === "true") {
    await collection.deleteMany({});
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, message: "All reviews deleted" }),
    };
  }

  if (!id) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing review id" }),
    };
  }

  await collection.deleteOne({ _id: new require("mongodb").ObjectId(id) });

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ success: true, message: "Review deleted" }),
  };
}


    // ------------------ INVALID METHOD ------------------
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Server error", details: err.message }),
    };
  }
};




// // netlify/functions/reviews.js
// const { MongoClient } = require("mongodb");

// let cachedClient = null;

// exports.handler = async (event) => {
//   if (event.httpMethod === "OPTIONS") {
//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//       },
//       body: "OK",
//     };
//   }

//   try {
//     if (!cachedClient) {
//       cachedClient = new MongoClient(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       await cachedClient.connect();
//     }

//     const db = cachedClient.db("feshlo");
//     const collection = db.collection("reviews");

//     if (event.httpMethod === "POST") {
//       const { name, text, rating } = JSON.parse(event.body || "{}");

//       if (!name || !text || !rating) {
//         return {
//           statusCode: 400,
//           headers: { "Access-Control-Allow-Origin": "*" },
//           body: JSON.stringify({ error: "Missing name, text, or rating" }),
//         };
//       }

//       const numericRating = Number(rating);
//       if (numericRating < 1 || numericRating > 5) {
//         return {
//           statusCode: 400,
//           headers: { "Access-Control-Allow-Origin": "*" },
//           body: JSON.stringify({ error: "Rating must be 1–5" }),
//         };
//       }

//       const newReview = { name, text, rating: numericRating, date: new Date() };
//       await collection.insertOne(newReview);

//       return {
//         statusCode: 200,
//         headers: { "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify({ success: true, review: newReview }),
//       };
//     }

//     if (event.httpMethod === "GET") {
//       const reviews = await collection.find().sort({ date: -1 }).toArray();
//       return {
//         statusCode: 200,
//         headers: { "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify(reviews), // 🔥 frontend expects array
//       };
//     }

//     return {
//       statusCode: 405,
//       headers: { "Access-Control-Allow-Origin": "*" },
//       body: JSON.stringify({ error: "Method not allowed" }),
//     };
//   } catch (err) {
//     return {
//       statusCode: 500,
//       headers: { "Access-Control-Allow-Origin": "*" },
//       body: JSON.stringify({ error: "Server error", details: err.message }),
//     };
//   }
// };


