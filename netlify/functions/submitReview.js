const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

exports.handler = async (event) => {
  try {
    if (!event.body || event.httpMethod !== 'POST') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad Request: A POST request with a body is required.' })
      };
    }

    await client.connect();
    const db = client.db('feshlo');
    const collection = db.collection('reviews');

    const body = JSON.parse(event.body);

    if (!body.review || !body.author) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad Request: Missing review or author data.' })
      };
    }

    const newReview = {
      review: body.review,
      author: body.author,
      createdAt: new Date(),
    };

    await collection.insertOne(newReview);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Review submitted successfully!" })
    };
  } catch (error) {
    console.error('Error submitting review:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit review' })
    };
  } finally {
    await client.close();
  }
};