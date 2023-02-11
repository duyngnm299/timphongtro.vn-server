const mongoose = require("mongoose");

const NotificationsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    title: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: String,
    },
    imagePath: { type: String },
  },
  { timestamps: true }
);

let Notification = mongoose.model("Notification", NotificationsSchema);
module.exports = { Notification };
