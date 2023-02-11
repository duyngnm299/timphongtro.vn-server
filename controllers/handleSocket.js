const handleSocket = (io) => {
  let users = [];

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  // user connected
  io.on("connection", (socket) => {
    console.log("connected");
    // take userId and socketId from user
    socket.on("addUser", async (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
      console.log("[getUsers]", users);
    });

    // send and get messages
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      console.log(senderId, receiverId, text);
      console.log("[users]", users);
      const user = await getUser(receiverId);
      console.log("[user]", user);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
        receiverId,
      });
    });
    socket.on("sendCurrentPost", async ({ senderId, receiverId, post }) => {
      console.log(senderId, receiverId, post);
      console.log("[users]", users);
      const user = await getUser(receiverId);
      io.to(user?.socketId).emit("getCurrentPost", {
        senderId,
        receiverId,
        post,
      });
    });
    // Khi ai đó đang nhập
    socket.on("entering", async (receiverId, sender) => {
      const user = await getUser(receiverId);
      io.to(user?.socketId).emit("notifyEntering", receiverId, sender);
    });
    // create notification when admin censor post
    socket.on("approvedPost", async ({ userId, title, postId, imagePath }) => {
      const user = await getUser(userId);
      io.to(user?.socketId).emit("getNotification", {
        userId,
        title,
        postId,
        imagePath,
      });
    });
    socket.on("expiredPost", async ({ userId, title, postId, imagePath }) => {
      console.log("[expired]: ", userId, title, postId, imagePath);
      const user = await getUser(userId);
      io.to(user?.socketId).emit("getExpiredPost", {
        userId,
        title,
        postId,
        imagePath,
      });
    });
    // user connected disconnected
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

module.exports = handleSocket;
