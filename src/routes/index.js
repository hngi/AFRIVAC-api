const router = require("express").Router();
const userRoutes = require("./userRoute");
//const destinationRoutes = require("./destinationRoutes")

module.exports = () => {
  // router.get("/test", (req, res) => res.send("Yeah it works!"));

  router.use("/users", userRoutes());
 // router.use("/popularDestinations", destinationRoutes());

  return router;
};
