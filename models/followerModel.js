const mongoose = require("mongoose");

const followSubSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const followerSubSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const followerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: true,
      ref: "user",
    },
    follows: [followSubSchema],
    followers: [followerSubSchema],
  },
  {
    timestamps: true,
  }
);

const followerModel = mongoose.model("follower", followerSchema);

module.exports = { followerModel };
