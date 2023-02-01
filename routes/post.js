const express = require("express");
const router = express.Router();

const { upload } = require("../helpers/filehelper");

const {
  createPost,
  getAllPost,
  updatePost,
  getPostOfUser,
  getPostListOfUser,
  checkExpiredPost,
  SearchFilterPost,
  deletedPost,
  getAllPostOfUser,
  updateExpiredPost,
  adminGetListPost,
  adminCensorPost,
  createPreviewPost,
  filterPostByMonth,
  filterPostByDate,
  filterPostByDistrict,
} = require("../controllers/post");
const middlewareController = require("../middleware/middleware");
router.post("/", upload.array("images"), createPost);
router.post("/preview-post", upload.array("images"), createPreviewPost);
router.post("/update/:id", upload.array("images"), updatePost);
router.put("/check/:id", checkExpiredPost);
router.get("/", getAllPost);
router.get("/:id", getPostOfUser);
router.post("/list", getPostListOfUser);
router.post("/search", SearchFilterPost);
router.post("/deleted/:id", deletedPost);
router.post("/allPostOfUser", getAllPostOfUser);
router.post("/update-expired/:id", updateExpiredPost);
router.get("/admin/getlistpost", adminGetListPost);
router.post("/admin/censor/:id", adminCensorPost);
router.get("/filter/month", filterPostByMonth);
router.get("/filter/date", filterPostByDate);
router.get("/filter/district", filterPostByDistrict);

module.exports = router;
