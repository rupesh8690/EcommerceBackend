const reviewModel = require("../../models/reviewProduct");
const userModel = require("../../models/userModel");

async function getReview(req, res) {
  try {
    const productId = req.params.id;

    // console.log("Product ID:", productId);
    // console.log("API hit successfully");

    if (!productId) {
      return res.status(400).json({
        message: "productId is required",
        success: false,
        error: true,
      });
    }

    // Fetch reviews and populate the user name
    const reviews = await reviewModel
      .find({ product: productId })
      .populate("user", "name"); // 

    // Format the output to include only required fields
    const formattedReviews = reviews.map((review) => ({
      name: review.user?.name || "Unknown User",
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));

    res.status(200).json({
      message: "Reviews fetched successfully",
      success: true,
      data: formattedReviews,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

module.exports = getReview;
