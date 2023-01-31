const express = require("express");
const router = express.Router();

const {
  addMessage,
  getMessage,
  updateSeen,
} = require("../controllers/message");

router.post("/", addMessage);
router.get("/:conversationId", getMessage);
// router.post("/update/:id", updateSeen);
module.exports = router;
