const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    profilePic: String,
    role: String,
    state: String,
    phone: String,
    address: String,

    //  fields for password reset functionality
    forgotPasswordToken: { type: String },
    forgotPasswordExpiry: { type: Date },
}, {
    timestamps: true
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
