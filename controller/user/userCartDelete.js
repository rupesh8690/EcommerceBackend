const cartModel = require("../../models/cartProduct");

async function userCartDelete(req, res) {
    try {
        console.log("userId", req.userId);

        // Delete all cart items for the user
        await cartModel.deleteMany({ userId: req.userId });

        res.status(200).json({
            data: [], // Empty array to indicate cart is empty
            error: false,
            message: "Your cart is now empty."
        });
    } catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).json({
            error: true,
            message: "Failed to clear your cart.",
            details: error.message
        });
    }
}

module.exports = userCartDelete;
