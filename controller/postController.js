const { userAuth } = require("../middleware/auth");
const { followerModel } = require("../models/followerModel");
const postModel = require("../models/postModel");

const createPost = async (req, res) => {
  const { post, image, video } = req?.body;
  const { user } = req?.query;
  const { io } = req?.notifySocket;

  //   console?.log(user);

  // Checking for missing field from the client request
  if (!post || !user) {
    console?.log({ message: "Invalid request due to missing field(s)" });
    return res
      ?.status(403)
      ?.json({ message: "Invalid request due to missing field(s)" });
  }

  try {
    const userPost = new postModel({ post, image, video, user });
    await userPost?.save();

    // Sending post notification to the user
    io?.emit("notification", `${user} has just make a post, ${post}`);

    console?.log({ message: "Post created successfully", data: userPost });
    return res
      ?.status(200)
      ?.json({ message: "Post created successfully", data: userPost });
  } catch (error) {
    console?.log({ message: "Failed to create post", error: error });
    return res
      ?.status(500)
      ?.json({ message: "Failed to create post", error: error });
  }
};

const userFeed = async (req, res) => {
  const { id, pageNo, recordPerPage } = req?.query;

  // Checking for missing field from the client request
  if (!id) {
    console?.log({ message: "Invalid request due to missing field" });
    return res
      ?.status(403)
      ?.json({ message: "Invalid request due to missing field" });
  }

  const followedUsers = await followerModel.findOne({ user: id });
  if (!followedUsers) {
    console?.log({ status: "Failed", message: "No followed user" });
    return res
      ?.status(500)
      ?.json({ status: "Failed", message: "No followed user" });
  }

  if (followedUsers) {
    console?.log("followedUsers = ", followedUsers);

    var feed = [];

    for (let index = 0; index < followedUsers?.follows?.length; index++) {
      const user = followedUsers?.follows[index].user;
      const post = await postModel?.find({ user });
      feed?.push(...post);
    }
    // Handling pagination
    const page = parseInt(pageNo);
    const pageSize =
      (parseInt(recordPerPage) > 10 && 10) || (parseInt(recordPerPage) ?? 5);
    const startIndex = pageSize * (page - 1);
    const endIndex = page * pageSize;
    const recordSize = feed?.length;

    const result = feed?.slice(startIndex, endIndex);
    const feedAndPage = {
      result,
      pageInfo: {
        currentPage: page,
        recordPerPage: pageSize,
        totalPages:
          recordSize % pageSize > 0
            ? Math?.floor(recordSize / pageSize) + 1
            : Math?.floor(recordSize / pageSize),
        totalRecords: recordSize,
      },
    };

    console?.log({
      status: "Success",
      message: "Followed user's posts was fetched",
      data: feedAndPage,
    });
    return res?.status(200)?.json({
      status: "Success",
      message: "Followed user's posts was fetched",
      data: feedAndPage,
    });
  }
};

module.exports = { createPost, userFeed };
