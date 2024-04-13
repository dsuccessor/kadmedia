const redis = require("redis");
const setResHeader = require("./setHeader");

const sendCatchedData = async (req, res, next) => {
  const reqRoute = req?.catchingRoute;
  // const redisClient = req?.redisConnect;
  console.log("catching route", reqRoute);
  // console.log("catching client", redisClient);

  const redisClient = await redis
    .createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  console.log("connected to redis");

  // Check if request is catched
  await redisClient
    .get(reqRoute)
    //.del(reqRoute)
    .then(async (response) => {
      if (response == null) {
        return next();
      } else {
        if (reqRoute === "login") {
          await setResHeader(res, req?.body);
        }
        console.log({
          status: "Success",
          message: "Catched data fetched",
          data: JSON.parse(response),
        });
        return res.status(200).json({
          status: "Success",
          message: "Catched data fetched",
          data: JSON.parse(response),
        });
      }
    })
    .catch((err) => {
      console.log({ message: err });
      return next();
    });
};

module.exports = { sendCatchedData };
