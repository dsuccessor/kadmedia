const { createPost, userFeed } = require("../controller/postController");
const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/userpost", userAuth, createPost);
// router.get("/feed", userAuth, userFeed);
router.get("/feed", userAuth, userFeed);

module.exports = router;
