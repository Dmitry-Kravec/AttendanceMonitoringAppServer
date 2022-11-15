const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Students = sequelize.define("students", {
  studID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING },
  patronymic: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  login: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
});

const Teachers = sequelize.define("teachers", {
  teacherID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING },
  patronymic: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  login: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
});

const Courses = sequelize.define("courses", {
  courseID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const Faculties = sequelize.define("faculties", {
  facultyID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const Groups = sequelize.define("groups", {
  groupID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const CourseLessons = sequelize.define("course_lessons", {
  lessonMainID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING },
});

const PracticeAndLectures = sequelize.define("practice_and_lectures", {
  lessonTypeID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: { type: DataTypes.STRING },
});

const LessonsWithGroupAndTeacher = sequelize.define(
  "lessons_with_group_and_teacher",
  {
    lessonInfID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  }
);

const StudentLessons = sequelize.define("student_lessons", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

const SpecificLessons = sequelize.define("specific_lessons", {
  lessonInfItemID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dayOfWeek: { type: DataTypes.STRING },
  typeOfWeek: { type: DataTypes.STRING },
  startTime: { type: DataTypes.TIME },
  endTime: { type: DataTypes.TIME },
  qrCode: { type: DataTypes.STRING },
});

const SessionRecords = sequelize.define("session_records", {
  recordID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dateOfLesson: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, defaultValue: "skipped" },
});

Teachers.hasMany(LessonsWithGroupAndTeacher);
LessonsWithGroupAndTeacher.belongsTo(Teachers);

Students.hasMany(SessionRecords);
SessionRecords.belongsTo(Students);

Students.hasMany(StudentLessons);
StudentLessons.belongsTo(Students);

Courses.hasMany(Students);
Students.belongsTo(Courses);

Courses.hasMany(CourseLessons);
CourseLessons.belongsTo(Courses);

Faculties.hasMany(Teachers);
Teachers.belongsTo(Faculties);

Faculties.hasMany(CourseLessons);
CourseLessons.belongsTo(Faculties);

Faculties.hasMany(Groups);
Groups.belongsTo(Faculties);

Groups.hasMany(Students);
Students.belongsTo(Groups);

Groups.hasMany(LessonsWithGroupAndTeacher);
LessonsWithGroupAndTeacher.belongsTo(Groups);

CourseLessons.hasMany(PracticeAndLectures);
PracticeAndLectures.belongsTo(CourseLessons);

PracticeAndLectures.hasMany(LessonsWithGroupAndTeacher);
LessonsWithGroupAndTeacher.belongsTo(PracticeAndLectures);

LessonsWithGroupAndTeacher.hasMany(StudentLessons);
StudentLessons.belongsTo(LessonsWithGroupAndTeacher);

LessonsWithGroupAndTeacher.hasMany(SpecificLessons);
SpecificLessons.belongsTo(LessonsWithGroupAndTeacher);

SpecificLessons.hasMany(SessionRecords);
SessionRecords.belongsTo(SpecificLessons);

module.exports = {
  Students,
  Teachers,
  Courses,
  Faculties,
  Groups,
  CourseLessons,
  PracticeAndLectures,
  LessonsWithGroupAndTeacher,
  StudentLessons,
  SpecificLessons,
  SessionRecords,
};
