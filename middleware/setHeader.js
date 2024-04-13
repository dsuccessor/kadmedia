const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const setResHeader = async (res, signObj) => {
  const token = await jwt.sign(signObj, process.env.AUTH_KEY, {
    expiresIn: 60 * 10,
  });

  res.setHeader("token", token);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("auth-token", token, {
      maxAge: 60 * 10,
      httpOnly: true,
      sameSite: "none",
      path: "/api",
    })
  );
};

module.exports = setResHeader;
