const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotificationOfUser,
  updateSeenNoti,
  readAllNotification,
} = require("../controllers/notification");
router.post("/create", createNotification);
router.get("/get-ntf-of-user/:id", getNotificationOfUser);
router.post("/update-seen/:id", updateSeenNoti);
router.post("/read-all/:id", readAllNotification);

module.exports = router;
