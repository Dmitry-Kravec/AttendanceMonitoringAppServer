const models = require("../models/models");
const ApiError = require("../error/apiError");

const bubbleObject = require("./utils/bubbleObject");

class StudentService {
    async getStudentPairHistory(email) {
        const student = await models.Students.findOne({
            where: { sfeduemail: email },
        });

        if (!student) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        let query = await models.Students.findAll({
            where: { sfeduemail: email },
            include: {
                model: models.PairVisitRecords,
                attributes: ["pairPairID", "status", "startTime"],
                include: {
                    model: models.Pairs,
                    attributes: ["qrCode"],
                    include: {
                        model: models.Lessons,
                        attributes: ["name", "lessonMainID"],
                        include: {
                            model: models.Teachers,
                            attributes: ["firstName", "lastName"],
                        },
                    },
                },
            },
        });

        const pairVisitRecordsList = query[0].pair_visit_records.map(
            (element) => {
                const bubbleObjectElement = bubbleObject(element);

                bubbleObjectElement.lessonName = bubbleObjectElement.name;
                bubbleObjectElement.teacherFirstName =
                    bubbleObjectElement.firstName;
                bubbleObjectElement.teacherLastName =
                    bubbleObjectElement.lastName;

                delete bubbleObjectElement.name;
                delete bubbleObjectElement.firstName;
                delete bubbleObjectElement.lastName;
                delete bubbleObjectElement.qrCode;

                return {
                    ...bubbleObjectElement,
                };
            }
        );

        return pairVisitRecordsList;
    }

    async checkQr(studentQrCode, email) {
        const student = await models.Students.findOne({
            where: { sfeduemail: email },
        });
        const pairs = await models.Pairs.findAll({
            where: { qrCode: studentQrCode },
        });

        if (pairs.length > 1) {
            throw ApiError.internal(
                "В таблице есть несколько одинаковых qr-кодов"
            );
        }

        if (pairs.length === 0) {
            throw ApiError.forbidden("В таблице нет указанного qr-кода");
        }

        const updatedRows = await models.PairVisitRecords.update(
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

        if (updatedRows[0] === 0) {
            throw ApiError.conflict("Студент не является участником занятия");
        }

        const lesson = await models.Lessons.findOne({
            where: { lessonMainID: pairs[0].lessonLessonMainID },
        });

        return lesson.name;
    }
}

module.exports = new StudentService();
