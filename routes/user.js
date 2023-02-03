const express = require("express");
const router = express.Router();
const { upload } = require("../helpers/filehelper");

const {
  getUser,
  getAllUser,
  getUserByEmail,
  updateUser,
  updateUserSavePost,
  deleteSavePost,
  deleteUser,
  getUserNewest,
  filterUserByMonth,
  filterUserByDate,
  updateUserReportedPost,
  deleteReportedPostOfUser,
} = require("../controllers/user");
const middlewareController = require("../middleware/middleware");

router.get("/:id", getUser);
router.get(
  "/",
  // middlewareController.verifyTokenAndAdminAuth,
  getAllUser
);
router.get("/get/newest", getUserNewest);
router.get("/email/:email", getUserByEmail);
router.post("/update/:id", upload.single("file"), updateUser);
router.post("/update-save-post/:id", updateUserSavePost);
router.post("/update-reported-post/:id", updateUserReportedPost);
router.post("/deleted-save-post/:id", deleteSavePost);
router.post("/deleted-reported-post/:id", deleteReportedPostOfUser);
router.post("/deleted/:id", deleteUser);
router.get("/filter/month", filterUserByMonth);
router.get("/filter/date", filterUserByDate);

module.exports = router;
