const { followerModel } = require("../models/followerModel");
const userModel = require("../models/userModel");

// Well commented
const followUser = async (req, res, next) => {
  const { followerId, followId } = req?.query;
  const { io } = req?.socketIo;
  const { admin } = req?.fcmAdmin;

  // If the id of the first user (follower) and second user (followee) is not specified
  if (!followerId || !followId) {
    console?.log({ message: "Incomplete request", status: "Failed" });
    return res
      ?.status(404)
      ?.json({ message: "Incomplete request", status: "Failed" });
  }

  //  if the id for user that want to follow (first user) is thesame with the id of the user he wanted to follow (user two)
  if (followerId == followId) {
    console?.log({ message: "You can not follow yourslef", status: "Failed" });
    return res
      ?.status(403)
      ?.json({ message: "You can not follow yourslef", status: "Failed" });
  }

  // Check If first user already follow the second user
  const followerExist = await followerModel?.findOne({ user: followerId });
  const followIdExist = followerExist?.follows?.find((item) => {
    return item?.user == followId;
  });

  //If first user already follow the second user
  if (followerExist && followIdExist) {
    console?.log({ message: "Already a follower", status: "Failed" });
    return res
      ?.status(500)
      ?.json({ message: "Already a follower", status: "Failed" });
  }

  //If first user had followed someone but not this second user
  if (followerExist && !followIdExist) {
    try {
      // add the second user to the list of the users the first user had followed
      followerExist?.follows?.push({ user: followId });
      await followerExist?.save();

      // Check If second user already has the first user on the list of the user that followed him
      const followExist = await followerModel?.findOne({ user: followId });
      const followerIdExist = followExist?.followers?.find((item) => {
        return item?.user == followerId;
      });

      // if second user did not have the first user on the list of users that had followed him
      if (followExist && !followerIdExist) {
        // Add the first user as a follower of the second user
        followExist?.followers?.push({ user: followerId });
        followExist?.save();
        console.log({ data: followExist });
      }

      //  if second user has not followed anyone nor anyone followed him
      if (!followExist) {
        // Add the first user as a follower of the second user
        const follower = await followerModel.create({
          user: followId,
          followers: { user: followerId },
        });
        console.log({ data: follower });
      }

      // Sending follow notification to the user
      io?.emit(
        "notification",
        `${followerId} has just followed your account ${followId}`
      );

      // Retrieve user's FCM token from the database
      const userDetails = await userModel.findById(followId);
      const fcmToken = userDetails.fcmtoken;

      // Send push notification using FCM
      await admin.messaging().sendToDevice(fcmToken, {
        notification: {
          title: "New Follow Notification",
          body: `${followerId} just follow you`,
        },
      });

      // Send feedback to the client side
      console?.log({
        message: "Followed Successfull",
        data: followerExist,
        status: "Success",
      });
      return res?.status(200)?.json({
        message: "Followed Successfull",
        data: followerExist,
        status: "Success",
      });
    } catch (err) {
      console?.log({
        message: "Failed to follow user",
        status: "Failed",
        error: err,
      });
      return res?.status(500)?.json({
        message: "Failed to follow user",
        status: "Failed",
        error: err,
      });
    }
  }

  // if first user has never followed anyone
  if (!followerExist) {
    // make first user follow the second user
    const follow = await followerModel?.create({
      user: followerId,
      follows: { user: followId },
    });

    if (follow) {
      // Check If second user already has the first user on the list of the user that followed him
      const followExist = await followerModel?.findOne({ user: followId });
      const followerIdExist = followExist?.followers?.find((item) => {
        return item?.user == followerId;
      });

      // if second user did not have the first user on the list of users that had followed him
      if (followExist && !followerIdExist) {
        // Add the first user as a follower of the second user
        followExist?.followers?.push({ user: followerId });
        followExist?.save();
        console.log({ data: followExist });
      }

      //  if second user has not followed anyone nor anyone followed him
      if (!followExist) {
        // Add the first user as a follower of the second user
        const follower = await followerModel.create({
          user: followId,
          followers: { user: followerId },
        });
        console.log({ data: follower });
      }

      // Sending follow notification to the user
      io?.emit(
        "notification",
        `${followerId} has just followed your account ${followId}`
      );

      // Retrieve user's FCM token from the database
      const userDetails = await userModel.findById(followId);
      const fcmToken = userDetails.fcmtoken;

      // Send push notification using FCM
      await admin.messaging().sendToDevice(fcmToken, {
        notification: {
          title: "New Follow Notification",
          body: `${followerId} just follow you`,
        },
      });

      // Send feedback to the client side
      console?.log({
        message: "Followed Successfull",
        data: follow,
        status: "Success",
      });
      return res?.status(200)?.json({
        message: "Followed Successfull",
        data: follow,
        status: "Success",
      });
    } else {
      console?.log({ message: "Follow attempt failed", status: "Failed" });
      return res
        ?.status(500)
        ?.json({ message: "Follow attempt failed", status: "Failed" });
    }
  }
};

const get_follows_followers = async (req, res) => {
  const { userId } = req?.query;

  // check if userId is not defined and reeturn error
  if (!userId) {
    console?.log({ message: "Incomplete request", status: "Failed" });
    return res
      ?.status(404)
      ?.json({ message: "Incomplete request", status: "Failed" });
  }

  // select from table follower where follower is userId
  const getRecord = await followerModel.findOne({ user: userId });

  // if no record found, return error
  if (!getRecord) {
    console?.log({
      message: "User has no follower and has never follow anyone",
      status: "Failed",
    });
    return res?.status(404)?.json({
      message: "User has no follower and has never follow anyone",
      status: "Failed",
    });
  }

  // if record is found, do the following
  if (getRecord) {
    // compute the count of follows and followers
    const noOfFollows = getRecord.follows.length;
    const noOfFollowers = getRecord.followers.length;

    // create another variable to hold the list of follows, followers and the total number of each
    const result = {
      noOfFollows,
      noOfFollowers,
      data: getRecord,
    };

    // Send feedback to the client side
    console?.log({
      message: "Result fetched",
      data: result,
      status: "Success",
    });
    return res?.status(200)?.json({
      message: "Result fetched",
      result,
      status: "Success",
    });
  }
};

module.exports = { followUser, get_follows_followers };
