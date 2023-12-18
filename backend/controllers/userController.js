const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("cloudinary");
const { createAndSaveTokenCookie } = require("../utils/createJwt");
const ErrorHandler = require("../utils/ErrorHandler");

exports.signUp = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return next(new ErrorHandler("User already exists", 400));

  let public_id = "none";
  let url = "none";
  if (req.body.avatar) {
    const myCloud = await cloudinary.v2.uploader.upload(
      req.body.avatar,
      { folder: "threads_avatars" },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );
    public_id = myCloud.public_id;
    url = myCloud.secure_url;
  }

  const newUser = await User.create({
    ...req.body,
    avatar: { public_id, url },
  });

  createAndSaveTokenCookie(newUser, 201, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please enter the email & password", 400));

  let user = await User.findOne({ email }).select("+password");

  if (!user)
    return next(new ErrorHandler("User Dosent exists with this email", 401));

  const correctPassword = await user.comparePassword(password);

  if (!correctPassword) return next(new ErrorHandler("Invalid Password", 401));

  createAndSaveTokenCookie(user, 200, res);
});

exports.signOut = catchAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Successfully Signed Out",
  });
});
