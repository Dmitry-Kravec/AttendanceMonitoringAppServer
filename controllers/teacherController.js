const ApiError = require("../error/apiError");
const models = require("../models/models");

class TeacherController {
  async getQrForLesson(req, res, next) {
    const { lessonID, pairID } = req.body;
    if (!lessonID && !pairID) {
      next(ApiError.badRequest("lessonID и pairID не заданы"));
    }

    const qrCode = generateUniqueKey();

    if (lessonID) {
      const newPair = await models.Pairs.create({
        dateTime: Date.now(),
        lessonLessonMainID: lessonID,
        qrCode,
      });

      // создание записи посещения для каждого студента с missing
      let students = await models.LessonsAndStudents.findAll({
        where: {
          lessonLessonMainID: lessonID,
        },
      });

      students = students.map((el) => {
        const {
          dataValues: { studentStudID },
        } = el;
        return studentStudID;
      });

      for (let i = 0; i < students.length; i++) {
        const newDefaultVisitRecords = await models.PairVisitRecords.create({
          startTime: Date.now(),
          status: "missing",
          studentStudID: students[i],
          pairPairID: newPair.pairID,
        });
      }

      res
        .status(200)
        .json({ pairID: newPair.pairID, qrCode, message: "created" });
    }

    await models.Pairs.update({ qrCode }, { where: { pairID } });

    res.status(200).json({ pairID, qrCode, message: "updated" });
  }

  async getTeacherLessonList(req, res) {
    const { email: sfeduemail } = req.query;

    const teacher = await models.Teachers.findOne({ where: { sfeduemail } });

    let lessonList = await models.Lessons.findAll({
      where: { teacherTeacherID: teacher.teacherID },
    });

    lessonList = lessonList.map((el) => {
      const {
        dataValues: { lessonMainID, name },
      } = el;
      return {
        lessonMainID,
        name,
      };
    });

    res.status(200).json(lessonList);
  }

  async getLessonInfo(req, res, next) {
    const { lessonID } = req.query;
    let lesson = await models.Lessons.findByPk(lessonID);
    if (!lesson) {
      next(ApiError.badRequest("Предмета не существует"));
    }
    let lessonName = lesson.dataValues.name;

    const pairsList = await getLessonInfoPairList(lessonID);

    const studentList = await getLessonInfoStudentList(lessonID);
    res.status(200).json({ name: lessonName, pairsList, studentList });
  }
}

//вспомогательные
async function getLessonInfoPairList(lessonID) {
  let pairList = await models.Pairs.findAll({
    where: { lessonLessonMainID: lessonID },
  });

  pairList = pairList.map((el) => {
    const {
      dataValues: { pairID, dateTime, lessonLessonMainID },
    } = el;
    //console.log("!! ", pairID, dateTime, lessonLessonMainID);
    return {
      pairID,
      dateTime,
      lessonLessonMainID,
    };
  });

  return pairList;
}

async function getLessonInfoStudentList(lessonID) {
  let students = await models.LessonsAndStudents.findAll({
    where: {
      lessonLessonMainID: lessonID,
    },
  });

  // массив id
  students = students.map((el) => {
    const {
      dataValues: { studentStudID },
    } = el;
    return studentStudID;
  });

  let studentList = [];
  for (let i = 0; i < students.length; i++) {
    let student = await models.Students.findOne({
      where: { studID: students[i] },
    });
    const { firstName, lastName, studID: ID, sfeduemail } = student;
    studentList.push({ firstName, lastName, ID, sfeduemail });
  }

  return studentList;
}

function generateUniqueKey() {
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4() +
    "-" +
    s4()
  );
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
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
