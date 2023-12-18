const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/User");

exports.checkAuth = catchAsync(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    return next(new ErrorHandler("Please Login to perform this action", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedData.id);
  req.user = user;

  next();
});
