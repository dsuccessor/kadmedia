const { createPost, userFeed } = require("../controller/postController");
const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const { sendCatchedData } = require("../middleware/catching");

router.post("/userpost", userAuth, createPost);
// router.get("/feed", userAuth, userFeed);
router.get(
  "/feed",
  userAuth,
  (req, res, next) => {
    req.catchingRoute = "feed";
    return next();
  },
  sendCatchedData,
  userFeed
);

module.exports = router;
