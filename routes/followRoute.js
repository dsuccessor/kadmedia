const express = require("express");
const {
  followUser,
  get_follows_followers,
} = require("../controller/followController");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const { sendCatchedData } = require("../middleware/catching");

router.post("/followuser", userAuth, followUser);
router.get(
  "/followersdata",
  userAuth,
  (req, res, next) => {
    req.catchingRoute = "followersdata";
    return next();
  },
  sendCatchedData,
  get_follows_followers
);

module.exports = router;
