const mongoose = require('mongoose');

// MongoDB connection string from environment variables
const mongoUri = process.env.MONGO_URI;

// Define the Review schema and model
const ReviewSchema = new mongoose.Schema({
  review: String,
  author: String,
  createdAt: { type: Date, default: Date.now }
});

let Review;

// Connect to MongoDB and define model if not already done
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
    await connect();
    const body = JSON.parse(event.body);

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