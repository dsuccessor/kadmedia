const mongoose = require("mongoose");

const subCommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    comment: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          unique: true,
          ref: "user",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const subLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "post",
  },
  comments: [subCommentSchema],
  likes: [
    {
      type: subLikeSchema,
      unique: true,
    },
  ],
});

const comment_like_Model = mongoose.model("comment_like", commentSchema);
// const commentModel = mongoose.model("comment", commentSchema);
// const likeModel = mongoose.model("comment", commentSchema);

module.exports = { comment_like_Model };
