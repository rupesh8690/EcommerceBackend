const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");

async function userPasswordResetController(req, res) {
  try {
    const { password, token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Invalid or missing token" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Please provide a new password" });
    }

    const tokenData = await userModel.findOne({
      forgotPasswordToken: token,
      forgotPasswordExpiry: { $gt: Date.now() }
    });

    if (!tokenData) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // hash new password before saving
    tokenData.password = await bcrypt.hash(password, 10);
    tokenData.forgotPasswordToken = undefined;
    tokenData.forgotPasswordExpiry = undefined;

    await tokenData.save();

    return res.json({
      message: "Password reset successful",
      success: true,
      error: false
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
      error: true
    });
  }
}

module.exports = userPasswordResetController;
