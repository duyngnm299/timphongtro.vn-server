const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  getCategory,
  deleteCategory,
} = require("../controllers/category");

router.get("/", getAllCategories);
router.post("/", createCategory);
router.get("/:id", getCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
