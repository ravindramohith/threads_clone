const {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
} = require("../controllers/userController");
const { checkAuth } = require("../middleware/auth");
const router = require("express").Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.get("/me", checkAuth, getCurrentUser);

module.exports = router;
