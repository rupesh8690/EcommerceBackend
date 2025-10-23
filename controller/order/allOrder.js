const orderModel = require("../../models/orderModel");
const userModel = require("../../models/userModel");

async function allOrders(req, res) {
  try {
    // Fetch all orders, sorted by newest first
    const orders = await orderModel
      .find()
      .populate("user", "email state phone address") // selected user fields
      .populate("products.product", "productName _id") // selected product fields
      .sort({ createdAt: -1 });

    // Check if there are any orders
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found",
        success: false,
      });
    }

    console.log("Fetched Orders:", orders); // Debugging log

    // Format the response to include only required fields
    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      userEmail: order.user?.email,
      phone: order.user?.phone,
      state: order.user?.state,
      address: order.user?.address,
      products: order.products.map((p) => ({
        productId: p.product?._id,
        productName: p.product?.productName,
        quantity: p.quantity,
      })),
      status: order.status,
    }));

    // Send formatted response
    res.status(200).json({
      message: "All orders fetched successfully",
      data: formattedOrders,
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = allOrders;
