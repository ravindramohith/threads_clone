const { signUp, signIn, signOut } = require("../controllers/userController");
const router = require("express").Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);

module.exports = router;
