const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

async function updateUserProfile(req, res) {
  try {
    const { name, address, phone, state } = req.body;

    if (!name) throw new Error("Please provide name");
    if (!address) throw new Error("Please provide address");
    if (!phone) throw new Error("Please provide phone");
    if (!state) throw new Error("Please provide state");




    const payload = {
      ...req.body,
      role: "GENERAL"
    };

    const updateUser = await userModel.findByIdAndUpdate(req.userId, payload, { new: true });

    res.status(201).json({
      data: updateUser,
      success: true,
      error: false,
      message: "User updated Successfully!"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

module.exports = updateUserProfile;
