const Router = require("express");
const router = new Router();
const loginController = require("../controllers/loginController");

router.post("/registration", loginController.registration);
router.post("/login", loginController.login);

router.put("/mailaccesscode", loginController.sendMailAccessCode);

module.exports = router;
