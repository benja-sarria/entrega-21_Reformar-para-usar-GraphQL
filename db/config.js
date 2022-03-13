const path = require("path");

module.exports = {
    mariaDB: {
        client: "mysql",
        connection: {
            host: "192.168.64.2",
            port: 3306,
            user: "root",
            password: "",
            database: "test",
        },
    },
    sqlite: {
        client: "sqlite3",
        connection: {
            filename: path.resolve(__dirname, "./ecommerce.sqlite"),
        },
    },
};
