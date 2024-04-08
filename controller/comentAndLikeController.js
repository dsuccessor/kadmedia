const { comment_like_Model } = require("../models/commentModel");

// well commented
const commentOnPost = async (req, res) => {
  const { postId, userId } = req.query;
  const { comment, image, video } = req.body;
  const io = req.notifySocket;

  // checking if all variables needed for the requests are present
  if (!postId || !userId || !comment) {
    console.log({ message: "Invalid request", status: "Failed" });
    res.status(400).json({ message: "Invalid request", status: "Failed" });
  }

  // Checking if any user has commented on the current post
  const postExist = await comment_like_Model.findOne({ post: postId });

  // posting comment under the current post
  if (postExist) {
    try {
      postExist.comments.push({ user: userId, comment, image, video });
      postExist.save();

      // Sending comment notification to the user
      io.emit(
        "notification",
        `${userId} has just commeted on your post, ${postId}`
      );

      // sending feedback to the client
      console.log({
        message: "Comment Saved",
        status: "success",
        data: postExist,
      });
      res
        .status(200)
        .json({ message: "Comment Saved", status: "success", data: postExist });
    } catch (error) {
      console.log({
        message: "Failed to save comment",
        status: "Failed",
        error: error,
      });
      res.status(500).json({
        message: "Failed to save comment",
        status: "Failed",
        error: error,
      });
    }
  }

  if (!postExist) {
    const postComment = await comment_like_Model.create({
      post: postId,
      comments: { user: userId, comment, image, video },
    });

    if (!postComment) {
      console.log({
        message: "Failed to save comment",
        status: "Failed",
      });

      res.status(500).json({
        message: "Failed to save comment",
        status: "Failed",
      });
    }

    if (postComment) {
      // Sending comment notification to the user
      io.emit(
        "notification",
        `${userId} has just commeted on your post, ${postId}`
      );

      console.log({
        message: "Comment Saved",
        status: "success",
        data: postComment,
      });
      res.status(200).json({
        message: "Comment Saved",
        status: "success",
        data: postComment,
      });
    }
  }
};

const likePost = async (req, res) => {
  const { postId, userId } = req.query;
  const io = req.notifySocket;

  // checking if all variables needed for the requests are present
  if (!postId || !userId) {
    console.log({ message: "Invalid request", status: "Failed" });
    res.status(400).json({ message: "Invalid request", status: "Failed" });
  }

  // Checking if any user has liked the current post
  const postExist = await comment_like_Model.findOne({ post: postId });
  //  if yes,
  if (postExist) {
    // checking if the post has been liked by the user before
    const userExist = postExist.likes.find((item) => {
      return item.user == userId;
    });
    //  if yes, then inform the user by sending feedback to the client
    if (userExist) {
      console.log({
        message: "User already like the post",
        status: "Failed",
      });
      res
        .status(403)
        .json({ message: "User already like the post", status: "Failed" });
    } else {
      // Complete the like request
      try {
        postExist.likes.push({ user: userId });
        postExist.save();

        // Sending like notification to the user
        io.emit(
          "notification",
          `${userId} has just liked your post, ${postId}`
        );

        // Sending like feedback to the user through the client
        console.log({
          message: "Post was liked",
          status: "success",
          data: postExist,
        });
        res.status(200).json({
          message: "Post was liked",
          status: "success",
          data: postExist,
        });
      } catch (error) {
        console.log({
          message: "Like failed",
          status: "Failed",
          error: error,
        });
        res.status(500).json({
          message: "Like failed",
          status: "Failed",
          error: error,
        });
      }
    }
  }

  // if no user has ever liked the post before
  if (!postExist) {
    // Complete the like request
    const likePost = await comment_like_Model.create({
      post: postId,
      likes: { user: userId },
    });

    if (!likePost) {
      console.log({
        message: "Failed to like post",
        status: "Failed",
      });

      res.status(500).json({
        message: "Failed to like post",
        status: "Failed",
      });
    }

    if (likePost) {
      // Sending like notification to the user
      io.emit("notification", `${userId} has just liked your post, ${postId}`);

      // Sending like feedback to the user through client
      console.log({
        message: "Post Liked",
        status: "success",
        data: likePost,
      });
      res.status(200).json({
        message: "Post Liked",
        status: "success",
        data: likePost,
      });
    }
  }
};

const commentPerPost = async (req, res) => {
  const { postId } = req.query;

  // checking if all variables needed for the requests are present
  if (!postId) {
    console.log({ message: "Invalid request", status: "Failed" });
    res.status(400).json({ message: "Invalid request", status: "Failed" });
  }

  // if post already been commented by anyone
  const postExist = await comment_like_Model.findOne({ post: postId });

  // if no, inform the user
  if (!postExist) {
    console.log({ message: "Post not exist", status: "Failed" });
    res.status(404).json({ message: "Post not exist", status: "Failed" });
  }

  // if yes,
  if (postExist) {
    // compute the request and feedback to the client
    const commentPerPost = postExist.comments;
    const noOfComment = postExist.comments.length;
    console.log({
      message: "No of comment fetched",
      status: "success",
      data: { commentPerPost, noOfComment },
    });
    res.status(200).json({
      message: "No of comment fetched",
      status: "success",
      data: { commentPerPost, noOfComment },
    });
  }
};

const likePerPost = async (req, res) => {
  const { postId } = req.query;

  // checking if all variables needed for the requests are present
  if (!postId) {
    console.log({ message: "Invalid request", status: "Failed" });
    res.status(400).json({ message: "Invalid request", status: "Failed" });
  }

  // if post already been liked by anyone
  const postExist = await comment_like_Model.findOne({ post: postId });

  // if no, feed the user back
  if (!postExist) {
    console.log({ message: "Post not exist", status: "Failed" });
    res.status(404).json({ message: "Post not exist", status: "Failed" });
  }

  // if yes, compute like per post and send response back to the client
  if (postExist) {
    const likePerPost = postExist.likes;
    const noOfLike = postExist.likes.length;
    console.log({
      message: "No of likes fetched",
      status: "success",
      data: { likePerPost, noOfLike },
    });
    res.status(200).json({
      message: "No of likes fetched",
      status: "success",
      data: { likePerPost, noOfLike },
    });
  }
};

module.exports = { commentOnPost, likePost, commentPerPost, likePerPost };
