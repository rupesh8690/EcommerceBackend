const userModel = require("../../models/userModel")  // MongoDB User model
const bcrypt = require('bcryptjs');                   // For hashing passwords (not used here yet)
const crypto = require('crypto');                     // For generating secure random tokens
    // Utility function to send emails
const sendEmail = require("../../utils/sendEmail")

async function userForgotPasswordController(req,res){
    try{
        const { email } = req.body
        if(!email){
            throw new Error("Please provide email")
        }
        const user = await userModel.findOne({email})
        if(!user){
            throw new Error("User not found")
        }
        const token = crypto.randomBytes(32).toString("hex")
        user.forgotPasswordToken = token
        user.forgotPasswordExpiry = Date.now() + 3600000
        await user.save()
        const resetLink = `http://localhost:5000/api/user/reset-password/${token}`
        const message = `Forgot your password? Click on this link to reset it: ${resetLink}`
        await sendEmail({
            email: user.email,
            subject: "Password Reset",
            message :"Click on the link to reset your password"
        })
        res.json({
            message: "Password reset link sent to your email",
            error: false,
            success: true
        })
    }catch(error){
        res.json({
            message : error.message || error  ,
            error : true,
            success : false,
        })
    }

}
module.exports = userForgotPasswordController