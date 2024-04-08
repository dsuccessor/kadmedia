const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie");

const registerUser = async (req, res) => {
  const {
    username,
    lastname,
    firstname,
    email,
    phone,
    passport,
    gender,
    password,
  } = req.body;

  //   Check if the fields coming from the client is completed
  if (
    !username ||
    !lastname ||
    !firstname ||
    !email ||
    !phone ||
    !passport ||
    !gender ||
    !password
  ) {
    console.log({
      message: "Incomplete field, Kindly provide the missing field",
    });
    return res
      .status(404)
      .json({ message: "Incomplete field, Kindly provide the missing field" });
  }

  // Check if user account already exists
  const ifUserExist = await userModel.findOne({ email });
  if (ifUserExist) {
    console.log({ message: `User already exist ${ifUserExist?.email}` });
    return res
      .status(404)
      .json({ message: `User already exist ${ifUserExist?.email}` });
  }

  // Encrypt password before creating user account
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    console.log({ message: `Failed to hash password` });
    return res.status(500).json({ message: "Failed to encrypt user password" });
  }

  // Create a user acount
  const register = await userModel
    .create({
      username,
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      gender,
      passport,
    })
    .then((data) => {
      if (data) {
        console.log({
          message: "User account created successfully",
          data: data,
        });
        return res
          .status(200)
          .json({ message: "User account created successfully", data: data });
      }
    })
    .catch((err) => {
      if (err) {
        console.log({ message: "Failed to register user", error: err });
        return res
          .status(500)
          .json({ message: "Failed to register user", error: err });
      }
    });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Checking if username and password is supplied from the client
  if (!email || !password) {
    console.log({ message: "Username or Password is required" });
    return res
      .status(404)
      .json({ message: "Username or Password is required" });
  }

  // Check if username and password is valid
  const userValid = await userModel.findOne({ email });

  if (!userValid) {
    console.log({ message: "Invalid email address, Access denied." });
    return res
      .status(400)
      .json({ message: "Invalid email address, Access denied." });
  }

  const passwordCheck = await bcrypt.compare(password, userValid?.password);
  if (!passwordCheck) {
    console.log({ message: "Invalid password" });
    return res.status(403).json({ message: "Invalid password" });
  }

  const token = await jwt.sign({ email, password }, process.env.AUTH_KEY, {
    expiresIn: 60 * 10,
  });

  console.log({
    message: "Credentials confirmed, Access granted.",
    data: userValid,
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
  return res.status(200).json({
    message: "Credentials confirmed, Access granted.",
    data: userValid,
  });

  // .then(async (result) => {
  //   if (result) {
  //     const passwordCheck = await bcrypt.compare(password, result?.password);

  //     if (!passwordCheck) {
  //       console.log({ message: "Invalid password" });
  //       return res.status(403).json({ message: "Invalid password" });
  //     }
  //     console.log({
  //       message: "Credentials confirmed, Access granted.",
  //       data: result,
  //     });
  //     return res
  //       .status(200)
  //       .json({
  //         message: "Credentials confirmed, Access granted.",
  //         data: result,
  //       });
  //   }
  // })
  // .catch((err) => {
  //   if (err) {
  //     console.log({ message: "Invalid email address, Access denied." });
  //     return res
  //       .status(200)
  //       .json({ message: "Invalid email address, Access denied." });
  //   }
  // });
};

module.exports = { registerUser, loginUser };
