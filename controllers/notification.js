const { Notification } = require("../models/Notifications");

const createNotification = async (req, res) => {
  try {
    const { userId, title, postId, imagePath } = req.body;
    const notification = await Notification.create({
      userId,
      title,
      postId,
      imagePath,
    });
    return res.status(200).json({ notification });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getNotificationOfUser = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await Notification.find({ userId: id }).sort({
      ["createdAt"]: "desc",
    });
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const updateSeenNoti = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );
    return res.status(200).json({ notification });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const readAllNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await Notification.find({ userId: id });
    if (notifications.length) {
      notifications.map((item) => {
        item.seen = true;
        item.save();
      });
      return res.status(200).json({ notifications });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = {
  createNotification,
  getNotificationOfUser,
  updateSeenNoti,
  readAllNotification,
};
