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
  filterPostByCategory,
  createReportedPost,
  deletedReportedPost,
  getAllReported,
  getDetailReported,
  getReportedByPostId,
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
router.get("/filter/category", filterPostByCategory);
router.post("/create/reported", createReportedPost);
router.post("/deleted/reported/:id", deletedReportedPost);
router.get("/get-all/reported", getAllReported);
router.post("/detail/reported/:id", getDetailReported);
router.get("/get-reported-by-post-id/:id", getReportedByPostId);

module.exports = router;
