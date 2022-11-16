const models = require("../models/models");
const ApiError = require("../error/apiError");

class StudentService {
    async getStudentPairHistory(email) {
        const student = await models.Students.findOne({
            where: { sfeduemail: email },
        });

        if (!student) {
            throw ApiError.badRequest("Пользователь не найден");
        }

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

        return pairVisitRecordsList;
    }

    async checkQr(studentQrCode, email) {
        const student = await models.Students.findOne({
            where: { sfeduemail: email },
        });
        const pairs = await models.Pairs.findAll({
            where: { qrCode: studentQrCode },
        });

        console.log(pairs.length);

        if (pairs.length > 1) {
            throw ApiError.internal(
                "В таблице есть несколько одинаковых qr-кодов"
            );
        }

        if (pairs.length === 0) {
            throw ApiError.forbidden("В таблице нет указанного qr-кода");
        }

        await models.PairVisitRecords.update(
            {
                startTime: Date.now(),
                status: "mark",
            },
            {
                where: {
                    studentStudID: student.studID,
                    pairPairID: pairs[0].pairID,
                },
            }
        );

        const lesson = await models.Lessons.findOne({
            where: { lessonMainID: pairs[0].lessonLessonMainID },
        });

        return lesson.name;
    }
}

module.exports = new StudentService();
