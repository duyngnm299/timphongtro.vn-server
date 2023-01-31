const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const server = require("http").createServer(app);
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");
const transactionRoutes = require("./routes/transaction");
const handleChat = require("./controllers/chat");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
dotenv.config();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use(express.json());
handleChat(io);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);
app.use("/conversation", conversationRoutes);
app.use("/message", messageRoutes);
app.use("/transaction", transactionRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() =>
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
