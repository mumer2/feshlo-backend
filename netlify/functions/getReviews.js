const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    const filePath = path.join(__dirname, "reviews.json");
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
    const data = fs.readFileSync(filePath, "utf-8");
    const reviews = JSON.parse(data);
    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
    };
  } catch (err) {
    return { statusCode: 500, body: "Error fetching reviews" };
  }
};
