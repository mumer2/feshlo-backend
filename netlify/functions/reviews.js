// netlify/functions/reviews.js
const { MongoClient } = require("mongodb");

let cachedClient = null;

exports.handler = async (event) => {
  const FUNCTION_NAME = "Reviews Function";
  console.log(`👉 ${FUNCTION_NAME} Incoming request:`, event);

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: JSON.stringify({ message: "CORS preflight OK" }),
    };
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await cachedClient.connect();
      console.log("✅ MongoDB connected");
    }

    const db = cachedClient.db("feshlo");
    const collection = db.collection("reviews");

    // ➤ POST: Add a review with rating
    if (event.httpMethod === "POST") {
      const { name, text, rating } = JSON.parse(event.body || "{}");

      if (!name || !text || !rating) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Missing name, text, or rating" }),
        };
      }

      const newReview = { name, text, rating: Number(rating), date: new Date() };
      await collection.insertOne(newReview);

      // Recalculate average rating
      const stats = await collection
        .aggregate([
          {
            $group: {
              _id: null,
              avgRating: { $avg: "$rating" },
              total: { $sum: 1 },
            },
          },
        ])
        .toArray();

      const summary = stats.length
        ? { averageRating: stats[0].avgRating, totalReviews: stats[0].total }
        : { averageRating: 0, totalReviews: 0 };

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true, review: newReview, summary }),
      };
    }

    // ➤ GET: Fetch reviews + rating summary
    if (event.httpMethod === "GET") {
      const reviews = await collection.find().sort({ date: -1 }).toArray();

      const stats = await collection
        .aggregate([
          {
            $group: {
              _id: null,
              avgRating: { $avg: "$rating" },
              total: { $sum: 1 },
            },
          },
        ])
        .toArray();

      const summary = stats.length
        ? { averageRating: stats[0].avgRating, totalReviews: stats[0].total }
        : { averageRating: 0, totalReviews: 0 };

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ reviews, summary }),
      };
    }

    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (err) {
    console.error(`${FUNCTION_NAME} error:`, err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};



// // netlify/functions/reviews.js
// const { MongoClient } = require("mongodb");

// // Cached MongoClient to prevent multiple connections on Netlify
// let cachedClient = null;

// exports.handler = async (event) => {
//   const FUNCTION_NAME = "Reviews Function";
//   console.log(`👉 ${FUNCTION_NAME} Incoming request:`, event);

//   // Handle CORS preflight
//   if (event.httpMethod === "OPTIONS") {
//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//       },
//       body: JSON.stringify({ message: "CORS preflight OK" }),
//     };
//   }

//   try {
//     // Connect to MongoDB once per function invocation
//     if (!cachedClient) {
//       cachedClient = new MongoClient(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       await cachedClient.connect();
//       console.log("✅ MongoDB connected");
//     }

//     const db = cachedClient.db("feshlo");
//     const collection = db.collection("reviews");

//     // Handle POST request (submit review)
//     if (event.httpMethod === "POST") {
//       const { name, text } = JSON.parse(event.body || "{}");
//       if (!name || !text) {
//         return {
//           statusCode: 400,
//           headers: { "Access-Control-Allow-Origin": "*" },
//           body: JSON.stringify({ error: "Missing name or text" }),
//         };
//       }

//       const newReview = { name, text, date: new Date() };
//       await collection.insertOne(newReview);

//       return {
//         statusCode: 200,
//         headers: { "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify({ success: true, review: newReview }),
//       };
//     }

//     // Handle GET request (fetch reviews)
//     if (event.httpMethod === "GET") {
//       const reviews = await collection.find().sort({ date: -1 }).toArray();
//       return {
//         statusCode: 200,
//         headers: { "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify(reviews),
//       };
//     }

//     return {
//       statusCode: 405,
//       headers: { "Access-Control-Allow-Origin": "*" },
//       body: JSON.stringify({ error: "Method not allowed" }),
//     };
//   } catch (err) {
//     console.error(`${FUNCTION_NAME} error:`, err);
//     return {
//       statusCode: 500,
//       headers: { "Access-Control-Allow-Origin": "*" },
//       body: JSON.stringify({ error: "Server error" }),
//     };
//   }
// };
