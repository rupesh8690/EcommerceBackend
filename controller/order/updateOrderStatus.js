const orderModel = require("../../models/orderModel");

async function updateOrderStatus(req, res) {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "orderId and status are required",
        success: false,
        error: true,
      });
    }

    // Validate allowed statuses
    const allowedStatuses = ["pending", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid status value",
        success: false,
        error: true,
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: status.toLowerCase() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      success: true,
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

module.exports = updateOrderStatus;
