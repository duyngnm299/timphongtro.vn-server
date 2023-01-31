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
router.post("/deleted-save-post/:id", deleteSavePost);
router.post("/deleted/:id", deleteUser);
router.get("/filter/month", filterUserByMonth);

module.exports = router;
