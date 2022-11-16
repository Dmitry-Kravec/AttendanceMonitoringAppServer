const Router = require("express");
const router = new Router();
const loginController = require("../controllers/loginController");

router.post("/login", loginController.login);

module.exports = router;
