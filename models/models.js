const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Students = sequelize.define("students", {
  studID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  sfeduemail: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  accesscode: { type: DataTypes.INTEGER },
});

const PairVisitRecords = sequelize.define("pair_visit_records", {
  visitID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  startTime: { type: DataTypes.DATE },
  endTime: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, defaultValue: "missing" },
});

const Pairs = sequelize.define("pairs", {
  pairID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dateTime: { type: DataTypes.DATE },
  qrCode: { type: DataTypes.STRING },
});

const Lessons = sequelize.define("lessons", {
  lessonMainID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
});

const Teachers = sequelize.define("teachers", {
  teacherID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  sfeduemail: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  accesscode: { type: DataTypes.INTEGER },
});

const LessonsAndStudents = sequelize.define("lessons_and_students", {
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

Students.hasMany(PairVisitRecords);
PairVisitRecords.belongsTo(Students);

Pairs.hasMany(PairVisitRecords);
PairVisitRecords.belongsTo(Pairs);

Teachers.hasMany(Lessons);
Lessons.belongsTo(Teachers);

Lessons.hasMany(Pairs);
Pairs.belongsTo(Lessons);

Students.belongsToMany(Lessons, { through: LessonsAndStudents });
Lessons.belongsToMany(Students, { through: LessonsAndStudents });

module.exports = {
  Students,
  PairVisitRecords,
  Pairs,
  Lessons,
  Teachers,
  LessonsAndStudents,
};
