const userModel = require("../../models/userModel");
const crypto = require('crypto');
const sendEmail = require("../../utils/sendEmail");

async function userForgotPasswordController(req, res) {
    try {
        const { email } = req.body;
        if (!email) throw new Error("Please provide email");

        const user = await userModel.findOne({ email });
        if (!user) throw new Error("User not found");

        const token = crypto.randomBytes(32).toString("hex");
        user.forgotPasswordToken = token;
        user.forgotPasswordExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `http://localhost:5000/api/user/reset-password/${token}`;

        await sendEmail({
            email: user.email,
            subject: "Password Reset",
            message: `Forgot your password? Click this link to reset it: ${resetLink}`
        });

        res.json({
            message: "Password reset link sent to your email",
            error: false,
            success: true
        });

    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

module.exports = userForgotPasswordController;
