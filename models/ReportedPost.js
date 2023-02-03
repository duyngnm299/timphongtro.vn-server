const mongoose = require("mongoose");

const reportedPostSchema = new mongoose.Schema(
  {
    idPost: { type: String },
    postCode: { type: String },
    titlePost: {
      type: String,
    },
    descReport: { type: Array },
    createdBy: { type: String },
    userFullName: { type: String },
    userEmail: { type: String },
    userPhoneNumber: { type: String },
  },
  { timestamps: true }
);
let ReportedPost = mongoose.model("ReportedPost", reportedPostSchema);
module.exports = { ReportedPost };
