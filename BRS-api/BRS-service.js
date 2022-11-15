class BRS_Service {
  data = [
    {
      teacherEmail: "teacher1@sfedu.ru",
      lessons: [
        {
          lessonName:
            "Практика математического анализа второй группы третьего курса",
          students: [
            "student1@sfedu.ru",
            "student2@sfedu.ru",
            "student3@sfedu.ru",
            "student4@sfedu.ru",
          ],
        },
        {
          lessonName:
            "Лекция математического анализа второй группы третьего курса",
          students: [
            "student1@sfedu.ru",
            "student2@sfedu.ru",
            "student3@sfedu.ru",
            "student4@sfedu.ru",
          ],
        },

        {
          lessonName: "Лекция алгебры и геометрии первой группы второго курса",
          students: [
            "student8@sfedu.ru",
            "student9@sfedu.ru",
            "student10@sfedu.ru",
          ],
        },
      ],
    },

    {
      teacherEmail: "teacher2@sfedu.ru",
      lessons: [
        {
          lessonName:
            "Лекция по теории вероянтностей третьей группы третьего курса",
          students: [
            "student5@sfedu.ru",
            "student6@sfedu.ru",
            "student7@sfedu.ru",
          ],
        },
        {
          lessonName: "Языки программирования первой группы второго курса",
          students: [
            "student8@sfedu.ru",
            "student9@sfedu.ru",
            "student10@sfedu.ru",
          ],
        },
      ],
    },
  ];

  students = [
    "student1@sfedu.ru",
    "student2@sfedu.ru",
    "student3@sfedu.ru",
    "student4@sfedu.ru",
    "student5@sfedu.ru",
    "student6@sfedu.ru",
    "student7@sfedu.ru",
    "student8@sfedu.ru",
    "student9@sfedu.ru",
    "student10@sfedu.ru",
    "student11@sfedu.ru",
  ];

  teachers = ["teacher1@sfedu.ru", "teacher2@sfedu.ru"];

  async getTeacherMailList() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.teachers);
      }, 300);
    });
  }

  async getStudentMailList() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.students);
      }, 300);
    });
  }

  async getTeacherLessons(teacherEmail) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let lessons = [];
        for (let el of this.data) {
          if (el.teacherEmail === teacherEmail) {
            el.lessons.forEach((item) => {
              lessons.push(item.lessonName);
            });
          }
        }
        resolve(lessons);
      }, 300);
    });
  }

  getStudentLessons(studentEmail) {
    let lessons = [];
    this.data.forEach((item) => {
      item.lessons.forEach((el) => {
        if (el.students.includes(studentEmail)) {
          lessons.push(el.lessonName);
        }
      });
    });
    return lessons;
  }

  async getAllStudentsLessons() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result = {};
        this.students.forEach((studentEmail) => {
          result[studentEmail] = this.getStudentLessons(studentEmail);
        });
        resolve(result);
      }, 300);
    });
  }
}

module.exports = new BRS_Service();
