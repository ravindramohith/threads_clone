const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("cloudinary");
const { createAndSaveTokenCookie } = require("../utils/createJwt");

exports.signUp = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });

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

