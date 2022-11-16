const models = require("../models/models");
const ApiError = require("../error/apiError");

class teacherService {
    async getTeacherLessonList(email) {
        const teacher = await models.Teachers.findOne({
            where: { sfeduemail: email },
        });

        if (!teacher) {
            throw ApiError.badRequest("Преподаватель не найден");
        }

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

        return lessonList;
    }

    async getLessonInfo(lessonID) {
        let lesson = await models.Lessons.findByPk(lessonID);
        if (!lesson) {
            throw ApiError.badRequest("Предмета не существует");
        }
        let lessonName = lesson.dataValues.name;

        const pairsList = await this.getLessonInfoPairList(lessonID);

        const studentList = await this.getLessonInfoStudentList(lessonID);
        return { name: lessonName, pairsList, studentList };
    }

    async createQrForLesson(lessonID) {
        if (!lessonID) {
            throw ApiError.badRequest("lessonID не задан");
        }

        const qrCode = this.generateUniqueKey();

        const lesson = await models.Lessons.findByPk(lessonID);
        if (!lesson) {
            throw ApiError.badRequest("Предмета не существует в базе данных");
        }

        const newPair = await models.Pairs.create({
            dateTime: Date.now(),
            lessonLessonMainID: lessonID,
            qrCode,
        });

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
            await models.PairVisitRecords.create({
                startTime: Date.now(),
                status: "missing",
                studentStudID: students[i],
                pairPairID: newPair.pairID,
            });
        }

        return {
            pairID: newPair.pairID,
            qrCode,
            message: "created",
        };
    }

    async refreshQrForPair(pairID) {
        if (!pairID) {
            throw ApiError.badRequest("pairID не задан");
        }

        const pair = await models.Pairs.findByPk(pairID);
        if (!pair) {
            throw ApiError.badRequest("Указанной пары нет в базе данных");
        }

        const qrCode = this.generateUniqueKey();

        await models.Pairs.update({ qrCode }, { where: { pairID } });

        return { pairID, qrCode, message: "updated" };
    }

    async getLessonInfoPairList(lessonID) {
        let pairList = await models.Pairs.findAll({
            where: { lessonLessonMainID: lessonID },
        });

        pairList = pairList.map((el) => {
            const {
                dataValues: { pairID, dateTime, lessonLessonMainID },
            } = el;

            return {
                pairID,
                dateTime,
                lessonLessonMainID,
            };
        });

        return pairList;
    }

    async getLessonInfoStudentList(lessonID) {
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

    generateUniqueKey() {
        const s4 = this.s4;
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

    s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
}

module.exports = new teacherService();
