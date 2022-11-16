const loginService = require("../service/login-service");

class UserController {
    async login(req, res, next) {
        const { email, password } = req.body;

        try {
            const userData = await loginService.login(email, password);
            res.set("Access-Control-Allow-Origin", "*");
            res.status(200).json(userData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
