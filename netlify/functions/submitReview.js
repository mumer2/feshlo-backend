const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

const ReviewSchema = new mongoose.Schema({
  review: String,
  author: String,
  createdAt: { type: Date, default: Date.now }
});

let Review;

const connect = async () => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(mongoUri, {
      dbName: 'feshlo',
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
  if (!Review) {
    Review = mongoose.model('reviews', ReviewSchema);
  }
};

exports.handler = async (event) => {
  try {
    // Check if the event body is empty or null.
    // This is the most critical fix for the JSON parsing error.
    if (!event.body || event.httpMethod !== 'POST') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad Request: A POST request with a body is required.' })
      };
    }

    await connect();
    const body = JSON.parse(event.body);

    // Verify that the required fields are present in the parsed body.
    if (!body.review || !body.author) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad Request: Missing review or author data.' })
      };
    }

    const newReview = new Review({
      review: body.review,
      author: body.author
    });

    await newReview.save();

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
  }
};