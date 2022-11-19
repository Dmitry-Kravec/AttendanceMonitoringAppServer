const models = require("../models/models");
const ApiError = require("../error/apiError");
const e = require("express");

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
            attributes: ["lessonMainID", "name"],
        });

        lessonList = lessonList.map((el) => el.dataValues);

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

        const lesson = await models.Lessons.findByPk(lessonID);
        if (!lesson) {
            throw ApiError.badRequest("Предмета не существует в базе данных");
        }

        const qrCode = this.generateUniqueKey();

        const newPair = await models.Pairs.create({
            dateTime: Date.now(),
            lessonLessonMainID: lessonID,
            qrCode,
        });

        let students = await models.LessonsAndStudents.findAll({
            where: {
                lessonLessonMainID: lessonID,
            },
            attributes: ["studentStudID"],
        });

        students = students.map((el) => el.dataValues.studentStudID);

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
            attributes: ["pairID", "dateTime", "lessonLessonMainID"],
        });

        pairList = pairList.map((el) => el.dataValues);

        return pairList;
    }

    async getLessonInfoStudentList(lessonID) {
        let query = await models.Lessons.findOne({
            where: {
                lessonMainID: lessonID,
            },
            include: {
                model: models.Students,
                through: {
                    attributes: [],
                },
                attributes: ["firstName", "lastName", "studID", "sfeduemail"],
            },
        });

        const studentList = query.dataValues.students.map(
            ({
                dataValues: { firstName, lastName, studID: ID, sfeduemail },
            }) => {
                return {
                    firstName,
                    lastName,
                    ID,
                    sfeduemail,
                };
            }
        );

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
