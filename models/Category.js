const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category_name: String,
});
module.exports = mongoose.model("Category", CategorySchema);
