const { findByIdAndUpdate } = require("../models/Message");
const Message = require("../models/Message");

const addMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    return res.status(200).json({ savedMessage });
  } catch (error) {
    return res.json(500).json({ error });
  }
};

const getMessage = async (req, res) => {
  try {
    const message = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// const updateSeen = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const msg = await Message.findByIdAndUpdate(
//       id,
//       { seen: true },
//       { new: true }
//     );
//     return res.status(200).json({ msg });
//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// };
module.exports = { addMessage, getMessage };
