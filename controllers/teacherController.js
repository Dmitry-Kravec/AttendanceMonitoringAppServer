const teacherService = require("../service/teacher-service");

class TeacherController {
    async getTeacherLessonList(req, res, next) {
        const { email } = req.query;

        try {
            const lessonList = await teacherService.getTeacherLessonList(email);
            res.status(200).json(lessonList);
        } catch (error) {
            next(error);
        }
    }

    async getLessonInfo(req, res, next) {
        const { lessonID } = req.query;
        try {
            const lessonInfo = await teacherService.getLessonInfo(lessonID);
            res.status(200).json(lessonInfo);
        } catch (error) {
            next(error);
        }
    }

    async createQrForLesson(req, res, next) {
        const { lessonID } = req.body;
        try {
            const qrLessonInfo = await teacherService.createQrForLesson(
                lessonID
            );
            res.status(200).json(qrLessonInfo);
        } catch (error) {
            next(error);
        }
    }

    async refreshQrForPair(req, res, next) {
        const { pairID } = req.body;

        try {
            const qrPairInfo = await teacherService.refreshQrForPair(pairID);
            res.status(200).json(qrPairInfo);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TeacherController();

/*
async createCourseLesson(req, res) {
    // courseID, facultyId name
    res.status(200).json({ message: "assaasa2" });
  }


async markStudentOnLesson(req, res, next) {
    const query = req.query;
    if (!query.test) {
      next(ApiError.badRequest("Test не задан в запросе"));
    }
    res.json(query);
  }
*/
