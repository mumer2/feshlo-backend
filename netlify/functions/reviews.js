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

      if (!productId || !name || !text || !rating) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Missing productId, name, text, or rating" }),
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
        productId, // 🔥 store productId
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
      const productId = event.queryStringParameters.productId;

      if (!productId) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Missing productId in query" }),
        };
      }

      const reviews = await collection
        .find({ productId }) // 🔥 filter by productId
        .sort({ date: -1 })
        .toArray();

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(reviews),
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
