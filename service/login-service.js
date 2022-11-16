const models = require("../models/models");
const ApiError = require("../error/apiError");

class LoginService {
    async login(email, password) {
        if (!email || !password) {
            throw ApiError.badRequest(" email или password не задан в запросе");
        }

        const student = await models.Students.findOne({
            where: { sfeduemail: email },
        });
        const teacher = await models.Teachers.findOne({
            where: { sfeduemail: email },
        });

        if (!student && !teacher) {
            throw ApiError.badRequest("Пользователь не найден");
        }

        const user = {
            userRole: student ? "студент" : "преподаватель",
            dataVaules: student ? student : teacher,
        };

        if (user.dataVaules.password === password) {
            const { studID, firstName, lastName, teacherID } = user.dataVaules;
            return {
                userRole: user.userRole,
                id: studID ? studID : teacherID,
                firstName,
                lastName,
                email,
                password,
            };
        } else {
            throw ApiError.forbidden("Неверный пароль");
        }
    }
}

module.exports = new LoginService();
