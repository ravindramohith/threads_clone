const { signUp } = require("../controllers/userController");
const router = require("express").Router();

router.post("/signup", signUp);

module.exports = router;
