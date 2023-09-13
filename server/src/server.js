const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const authenticationRouter = require("./routes/authenticationRouter");
const usersRouter = require("./routes/usersRouter");
const chatsRouter = require("./routes/chatsRouter");
const messagesRouter = require("./routes/messagesRouter");
const { handleErrors } = require("./middleware/handleErrorsMiddleware");
const _PORT = process.env.PORT;

connectDB();
const app = express();

// app.use(cors({ origin: "http://localhost:5173" }));
// app.use(cors({ origin: "https://chat-mern-app.vercel.app" }));
app.use(cors());
app.use(express.json());
app.use("/authentication", authenticationRouter);
app.use("/users", usersRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);
app.use(handleErrors);

app.get('/', (req, res, next) => {
  try {
    res.status(200).json({ message: 'Home Page Route' });
  } catch (error) {
    next(error)
  }
});

const server = app.listen(_PORT, () => console.log(`Server Works On ${_PORT}`));

// socket.io

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: { origin: "http://localhost:5173" }
// });
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: { origin: "https://chat-mern-app.vercel.app" }
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("UserLogIn", mainUserId => {
    if (!onlineUsers.some(u => u.userId === mainUserId)) {
      onlineUsers.push({ userId: mainUserId, socketId: socket.id });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", onlineUsers);
    io.emit("get-onlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (data) => {
    const { message, chatMessagesLength } = data;

    if (!message.chat.users) return null;

    message.chat.users.forEach(user => {
      if (user._id == message.sender._id) return null;

      const anotherUser = onlineUsers.find(u => u.userId == user._id);

      anotherUser && io.to(anotherUser.socketId).emit("receiveMessage", data);
    });
  });
});