const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userAuth = async (req, res, next) => {
  const token = req?.headers["token"];
  //   console.log("token =", token);
  if (!token) {
    console.log({ message: "Authentication Token is missing" });
    return res.status(401).json({ message: "Authentication Token is missing" });
  }

  const verifyToken = await jwt.verify(token, process.env.AUTH_KEY, (err) => {
    if (err) {
      console.log({ message: "Invalid authentication Token" });
      return res.status(401).json({ message: "Invalid authentication Token" });
    } else {
      next();
    }
  });
};

module.exports = { userAuth };
