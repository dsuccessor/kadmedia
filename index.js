const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
const Cors = require("cors");
const uri = process.env.MONGO_DB;
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const followRoute = require("./routes/followRoute");
const commentAndLike = require("./routes/commentandLikeRoute");
var admin = require("firebase-admin");
var serviceAccount = require("./libs/kadmedia-firebase-adminsdk-23j3m-58bac062ba.json");
// const redis = require("redis");

const app = express();
const port = process.env.PORT || 3001;

// Initialize Redis client
// const redisClient = redis.createClient();
// console.log("catching client 1", redisClient);

// Establishing mongoose connection
mongoose
  .connect(uri)
  .then((response) => console.log(`Connected to Mongo Database${response}`))
  .catch((err) =>
    console.log(`Failed to establish connection to Mongo Database, ${err}`)
  );

// App Middlewares
app.use(express.json());
app.use(Cors());

// Default Api Route
app.get("/", (req, res, next) => {
  res.send("<Div>Welcome to KadMedia Backend</div>");
});

// Initiating Real-time Notifications connection using Websockets
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user is connected");
});

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware to pass socket io to the controller
const notificationInstance = async (req, res, next) => {
  // const redisClient = redis.createClient();
  // redisClient.on("error", (err) => {
  //   return console.log("Redis Client Error", err);
  // });
  // await redisClient.connect();
  req.socketIo = io;
  req.fcmAdmin = admin;
  // req.redisConnect = redisClient;
  next();
};

// Apis
app.use("/api/user", notificationInstance, userRoute);
app.use("/api/post", notificationInstance, postRoute);
app.use("/api/follow", notificationInstance, followRoute);
app.use("/api/comment", notificationInstance, commentAndLike);
app.use("/api/like", notificationInstance, commentAndLike);

// Establishing server connection
const serverInstance = server.listen(port, (error) => {
  if (error) {
    console.log(`Failed to connect to server, ${error}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});

//Shutting down the server
process.on("SIGINT", () => {
  console.log("Server is shutting down");
  serverInstance.close(() => {
    console.log("Server is closed");
    process.exit(0);
  });
});
