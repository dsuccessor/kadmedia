const mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost:27017/test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })

const postSchema = new mongoose.Schema(
  {
    post: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
