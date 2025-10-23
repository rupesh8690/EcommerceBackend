

const orderModel = require('../../models/orderModel');

async function getUserPurchaseHistory(req, res) {
  try {
    const userId = req.userId;

    // Fetch orders and populate product details
    const orders = await orderModel
      .find({ user: userId })
      .populate({
        path: "products.product", // populate product field in products array
        select: "productName category productImage price", // select only required fields
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: orders,
      success: true,
      error: false,
      message: "User purchase history retrieved successfully!",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}

module.exports = getUserPurchaseHistory;
