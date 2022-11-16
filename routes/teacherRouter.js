const Router = require("express");
const router = new Router();
const teacherController = require("../controllers/teacherController");

router.get("/LessonList?:email", teacherController.getTeacherLessonList);
router.get("/LessonInfo?:lessonId", teacherController.getLessonInfo);

router.post("/newQr", teacherController.createQrForLesson);
router.put("/refreshQr", teacherController.refreshQrForPair);

module.exports = router;
