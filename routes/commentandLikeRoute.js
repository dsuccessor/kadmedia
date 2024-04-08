const express = require("express");
const {
  commentOnPost,
  likePost,
  commentPerPost,
  likePerPost,
} = require("../controller/comentAndLikeController");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/commentonpost", userAuth, commentOnPost);
router.post("/likepost", userAuth, likePost);
router.get("/commentperpost", userAuth, commentPerPost);
router.get("/likeperpost", userAuth, likePerPost);

module.exports = router;
