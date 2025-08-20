const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  try {
    const { name, review } = JSON.parse(event.body);

    if (!name || !review) return { statusCode: 400, body: "Invalid input" };

    const filePath = path.join(__dirname, "reviews.json");
    const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "[]";
    const reviews = JSON.parse(data);

    const newReview = { id: Date.now(), name, review, date: new Date().toISOString() };
    reviews.unshift(newReview); // Add to top

    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(newReview),
    };
  } catch (err) {
    return { statusCode: 500, body: "Error submitting review" };
  }
};
