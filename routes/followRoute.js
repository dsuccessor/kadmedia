const express = require("express");
const {
  followUser,
  get_follows_followers,
} = require("../controller/followController");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/followuser", userAuth, followUser);
router.get("/followersdata", userAuth, get_follows_followers);

module.exports = router;
