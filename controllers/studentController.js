const ApiError = require("../error/apiError");
const models = require("../models/models");

class StudentController {
  async getStudentPairHistory(req, res) {
    const { email: sfeduemail } = req.query;

    const student = await models.Students.findOne({ where: { sfeduemail } });

    //1
    let pairVisitRecordsList = await models.PairVisitRecords.findAll({
      where: { studentStudID: student.studID },
    });

    pairVisitRecordsList = pairVisitRecordsList.map((el) => {
      const {
        dataValues: { pairPairID, startTime, status },
      } = el;
      return {
        pairPairID,
        startTime,
        status,
      };
    });

    for (let i = 0; i < pairVisitRecordsList.length; i++) {
      const pair = await models.Pairs.findOne({
        where: { pairID: pairVisitRecordsList[i].pairPairID },
      });

      pairVisitRecordsList[i].lessonMainID = pair.lessonLessonMainID;
    }

    for (let i = 0; i < pairVisitRecordsList.length; i++) {
      const lesson = await models.Lessons.findOne({
        where: { lessonMainID: pairVisitRecordsList[i].lessonMainID },
      });

      const teacher = await models.Teachers.findOne({
        where: { teacherID: lesson.teacherTeacherID },
      });

      pairVisitRecordsList[i].lessonName = lesson.name;
      pairVisitRecordsList[i].teacherFirstName = teacher.firstName;
      pairVisitRecordsList[i].teacherLastName = teacher.lastName;
    }

    console.log(pairVisitRecordsList);

    res.status(200).json(pairVisitRecordsList);
  }

  async checkQr(req, res, next) {
    const { studentQrCode, email: sfeduemail } = req.body;

    const student = await models.Students.findOne({ where: { sfeduemail } });
    const pairs = await models.Pairs.findAll({
      where: { qrCode: studentQrCode },
    });

    console.log(pairs.length);

    if (pairs.length > 1) {
      next(ApiError.internal("В таблице есть несколько одинаковых qr-кодов"));
    }

    if (pairs.length === 0) {
      next(ApiError.forbidden("В таблице нет указанного qr-кода"));
    }

    const newVisitRecord = await models.PairVisitRecords.update(
      {
        startTime: Date.now(),
        status: "mark",
      },
      { where: { studentStudID: student.studID, pairPairID: pairs[0].pairID } }
    );

    const lesson = await models.Lessons.findOne({
      where: { lessonMainID: pairs[0].lessonLessonMainID },
    });

    res.status(200).json({ lessonName: lesson.name });
  }
}

module.exports = new StudentController();
