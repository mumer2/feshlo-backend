const { MongoClient } = require('mongodb');

// Best practice: Initialize the client outside the handler
// so it can be reused across subsequent function invocations (warm starts).
const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad Request: A POST request with a body is required.' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { author, review } = body;

    if (!author || !review) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad Request: Missing author or review data.' })
      };
    }

    // Connect to the database. The client.connect() call is smart enough
    // to not re-connect if a connection is already established.
    await client.connect();
    const db = client.db('feshlo');
    const collection = db.collection('reviews');

    const newReview = {
      review: review,
      author: author,
      createdAt: new Date(),
    };

    await collection.insertOne(newReview);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Review submitted successfully!" })
    };
  } catch (error) {
    console.error('Error in submit-review function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit review due to a server error.' })
    };
  }
};