const mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost:27017/test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    lastname: {
      type: String,
      required: true,
      lowercase: true,
    },
    firstname: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    fcmtoken: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      lowercase: true,
      length: 11,
      unique: true,
    },
    passport: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
