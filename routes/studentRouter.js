const Router = require("express");
const router = new Router();
const studentController = require("../controllers/studentController");

router.get("/history?:email", studentController.getStudentPairHistory);
router.put("/sendqr", studentController.checkQr);

module.exports = router;
