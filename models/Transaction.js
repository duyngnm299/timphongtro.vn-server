const mongoose = require("mongoose");
const moment = require("moment");

const transactionSchema = mongoose.Schema(
  {
    postCode: { type: String },
    transactionCode: { type: String },
    title: { type: String },
    typeTransaction: {
      type: String,
    },
    costs: {
      type: Number,
    },
    textNote: {
      type: String,
    },
    finalBalance: {
      type: Number,
    },
    district: {
      type: String,
    },
    createdBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    dayCreated: {
      type: String,
      default: moment(new Date()).format("D/M/YYYY"),
    },
    monthCreated: {
      type: String,
      default: moment(new Date()).format("MM/YYYY"),
    },
  },
  { timestamps: true }
);

let Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = { Transaction };
