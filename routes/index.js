const Router = require("express");
const router = new Router();

const loginRouter = require("./loginRouter");
const studentRouter = require("./studentRouter");
const teacherRouter = require("./teacherRouter");

router.use("/login", loginRouter);
router.use("/teacher", teacherRouter);
router.use("/student", studentRouter);

module.exports = router;
