const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const createConversation = async (req, res) => {
  const existedConv = await Conversation.findOne({
    members: [req.body.senderId, req.body.receiverId],
  });
  if (existedConv) {
    return res.status(200).json({ savedConversation: existedConv });
  }
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    return res.status(200).json({ savedConversation });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getConvOfUser = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    return res.status(200).json({ conversation });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

module.exports = { createConversation, getConvOfUser };
