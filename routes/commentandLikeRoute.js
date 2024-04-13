const express = require("express");
const {
  commentOnPost,
  likePost,
  commentPerPost,
  likePerPost,
} = require("../controller/comentAndLikeController");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const { sendCatchedData } = require("../middleware/catching");

router.post("/commentonpost", userAuth, commentOnPost);
router.post("/likepost", userAuth, likePost);
router.get(
  "/commentperpost",
  userAuth,
  (req, res, next) => {
    req.catchingRoute = "commentperpost";
    return next();
  },
  sendCatchedData,
  commentPerPost
);
router.get(
  "/likeperpost",
  userAuth,
  (req, res, next) => {
    req.catchingRoute = "likeperpost";
    return next();
  },
  sendCatchedData,
  likePerPost
);

module.exports = router;
