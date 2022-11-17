const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
    "postgres://iukkszge:uh9Bw1OpLRqzk4wI-0nlwZ3jOhoU5fG7@abul.db.elephantsql.com/iukkszge"
);

// module.exports = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         dialect: "postgres",
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//     }
// );
