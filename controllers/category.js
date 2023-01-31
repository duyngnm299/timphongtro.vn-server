const Category = require("../models/Category");

const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};
const getCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id });
  res.status(200).json({ category });
};
const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(200).json({ category });
};
const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);
  res.status(200).json({ category });
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  deleteCategory,
};
