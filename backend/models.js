const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 }, // Stronger password validation
    role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true }); // Adds createdAt & updatedAt fields

module.exports = mongoose.model("User", UserSchema);
