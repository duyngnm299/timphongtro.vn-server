const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    memberCode: {
      type: String,
    },

    fullName: {
      type: String,
    },
    gender: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      minlength: 8,
    },
    password: {
      type: String,
      minlength: 8,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
    profilePicture: { type: String },
    dateOfBirth: { type: String },
    address: {
      type: String,
    },
    province: {
      type: String,
    },
    district: {
      type: String,
    },
    ward: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    post: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
    },
    savedPost: { type: Array },
    balance: { type: Number, default: 0 },
    identityCard: { type: String },
    zalo: { type: String },
    typeAccount: {
      type: String,
      enum: ["normal", "google"],
      default: "normal",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = { User };
