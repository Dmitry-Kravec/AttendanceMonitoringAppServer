const Router = require("express");
const router = new Router();
const studentController = require("../controllers/studentController");

router.get("/history?:email", studentController.getStudentPairHistory);
router.post("/sendqr", studentController.checkQr);

module.exports = router;

/*
студенческий:
router.post("/markonLesson", studentController.markOnLesson);
router.post(
  "/subscribeforcourse/:courseid",
  studentController.subscribeForCourse
);
router.delete(
  "/unsubscribefromcourse/:courseid",
  studentController.unsubscribeFromCourse
);
*/
