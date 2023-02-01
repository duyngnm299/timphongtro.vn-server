const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Please provide category id"],
    },
    category_name: { type: String },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    describe: { type: Object, required: true },
    area: { type: Number, maxlength: 7 },
    price: { type: Number, default: 0, maxlength: 12 },
    address: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    street: { type: String, required: true },
    images: [Object],
    status: {
      type: String,
      default: "waiting for approva",
    },
    costPost: { type: Number },
    postCode: { type: String },
    numberDayPost: { type: Number },
    postType: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    userInfo: { type: Object },
    createdBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  },
  { timestamps: true }
);
let Post = mongoose.model("Post", postSchema);
module.exports = { Post };
