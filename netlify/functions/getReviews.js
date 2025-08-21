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

exports.handler = async () => {
  try {
    await connect();
    const reviews = await Review.find().sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(reviews)
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch reviews' })
    };
  }
};