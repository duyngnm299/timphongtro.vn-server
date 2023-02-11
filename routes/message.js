const express = require("express");
const router = express.Router();

const {
  addMessage,
  getMessage,
  getNewestMessage,
} = require("../controllers/message");

router.post("/", addMessage);
router.get("/:conversationId", getMessage);
router.get("/newest/:conversationId", getNewestMessage);
module.exports = router;
