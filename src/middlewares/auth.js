const jwt = require("jsonwebtoken");
const User = require("./../models/User");
const CustomError = require("./../utils/CustomError");

function auth() {
     return async (req, res, next) => {
          if(!req.body.email & !req.body.password){
               if (!req.headers.authorization) throw new CustomError("unauthorized user", 401);
               const token = req.headers.authorization.split(" ")[1];
               const decoded = await jwt.verify(token, process.env.JWT_SECRET);
               var user = await User.findOne({ _id: decoded.id });  
               if (!user || !user.isActive) throw new CustomError("unauthorized user", 401);
          } else {
               var user = await User.findOne({ email: req.body.email });  
               console.log(user);
               if (!user || !user.isActive) throw new CustomError("unauthorized user", 401);
          }

          req.user = user;

          next();
     }
}

module.exports = auth