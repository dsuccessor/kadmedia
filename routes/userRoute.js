const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controller/userController");
const { sendCatchedData } = require("../middleware/catching");

router.post("/register", registerUser);
router.get(
  "/auth/login",
  (req, res, next) => {
    req.catchingRoute = "login";
    return next();
  },
  sendCatchedData,
  loginUser
);

module.exports = router;
