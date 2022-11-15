const models = require("../models/models");
const ApiError = require("../error/apiError");

class UserController {
    async registration(req, res, next) {
        const { firstName, lastName, email, password, accesscode } = req.body;

        const student = await models.Students.findOne({
            where: { sfeduemail: email },
        });
        const teacher = await models.Teachers.findOne({
            where: { sfeduemail: email },
        });

        if (!student && !teacher) {
            next(ApiError.badRequest("Почта отсутствует в базе данных"));
        }

        const user = {
            userData: student ? student : teacher,
            userModel: student ? models.Students : models.Teachers,
            userRole: student ? "студент" : "преподаватель",
        };

        if (user.userData.accesscode != accesscode) {
            next(ApiError.forbidden("Код доступа не совпадает"));
        }

        const resu = await user.userModel.update(
            { password, firstName, lastName },
            { returning: true, where: { sfeduemail: email } }
        );

        res.status(200).json({
            userRole: user.userRole,
            id: student ? student.studID : teacher.teacherID,
            firstName,
            lastName,
            email,
            password,
        });
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            next(ApiError.badRequest(" email или password не задан в запросе"));
        }

        const student = await models.Students.findOne({
            where: { sfeduemail: email },
        });
        const teacher = await models.Teachers.findOne({
            where: { sfeduemail: email },
        });

        if (!student && !teacher) {
            next(ApiError.badRequest("Пользователь не найден"));
        }

        const user = {
            userRole: student ? "студент" : "преподаватель",
            dataVaules: student ? student : teacher,
        };

        if (user.dataVaules.password === password) {
            const { studID, firstName, lastName, teacherID } = user.dataVaules;
            res.set("Access-Control-Allow-Origin", "*");
            res.status(200).json({
                userRole: user.userRole,
                id: studID ? studID : teacherID,
                firstName,
                lastName,
                email,
                password,
            });
        } else {
            next(ApiError.forbidden("Неверный пароль"));
        }
    }

    async sendMailAccessCode(req, res, next) {
        const { email } = req.body;

        const student = await models.Students.findOne({
            where: { sfeduemail: email },
        });
        const teacher = await models.Teachers.findOne({
            where: { sfeduemail: email },
        });

        if (student) {
            const result = models.Students.update(
                { accesscode: 2222 },
                { returning: true, where: { sfeduemail: email } }
            );
            res.status(200).json({ message: "Код студента обновлён" });
        }

        if (teacher) {
            const result = models.Teachers.update(
                { accesscode: 2222 },
                { returning: true, where: { sfeduemail: email } }
            );
            res.status(200).json({ message: "Код преподавателя обновлён" });
        }

        next(ApiError.badRequest("Почты нет в базе данных"));
    }
}

module.exports = new UserController();
