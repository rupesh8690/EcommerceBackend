const reviewModel = require("../../models/reviewProduct");

async function reviewProduct(req, res) {
  try{
     const currentUser = req.userId;
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({
        message: "productId and rating are required",
        success: false,
        error: true,
      });
    }

    const newReview = new reviewModel({
      
      user: currentUser,
      product: productId,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({
      message: "Review added successfully",
      success: true,
      data: newReview,
    });
  }catch(err){
    res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}
module.exports = reviewProduct;