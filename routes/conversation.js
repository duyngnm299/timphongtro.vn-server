const express = require("express");
const router = express.Router();

const {
  createConversation,
  getConvOfUser,
} = require("../controllers/conversation");
//new conversation
router.post("/", createConversation);
router.get("/:userId", getConvOfUser);
// get conversation of a user

module.exports = router;
