const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

async function updateUserProfile(req, res) {
  try {
    const { name, password } = req.body;

    if (!name) throw new Error("Please provide name");
    if (!password) throw new Error("Please provide password");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      ...req.body,
      password: hashPassword
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
