const path = require("path")
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")))

mongoose
  .connect(
    "mongodb+srv://tue123:tue123@cluster0.zwg5h.mongodb.net/mean_project?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connect to Mongodb server!");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, OPTIONS, DELETE"
  );
  next();
});

app.use("/api/posts", postRouter);
app.use("/api/user", userRouter);

module.exports = app;
