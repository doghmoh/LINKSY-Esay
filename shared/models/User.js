const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    emailConfirmed: { type: Boolean, default: false },
    phoneNumber: { type: String, unique: true },
    phoneConfirmed: { type: Boolean, default: false },
    firstName: { type: String },
    lastName: { type: String },
    birthDate: { type: Date },
    address: { type: String },
    wilaya: { type: String },
    commune: { type: String },
    accountType: { type: String, enum: ["developer", "organization"] },
    password: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
