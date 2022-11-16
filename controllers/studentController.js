const studentService = require("../service/student-service");

class StudentController {
    async getStudentPairHistory(req, res, next) {
        const { email } = req.query;

        try {
            const pairVisitRecordsList =
                await studentService.getStudentPairHistory(email);
            res.status(200).json(pairVisitRecordsList);
        } catch (error) {
            next(error);
        }
    }

    async checkQr(req, res, next) {
        const { studentQrCode, email } = req.body;

        try {
            const lessonName = await studentService.checkQr(
                studentQrCode,
                email
            );
            res.status(200).json({ lessonName });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();
