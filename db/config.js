const path = require("path");

module.exports = {
    mariaDB: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "",
            database: "ecommerce",
        },
    },
    sqlite: {
        client: "sqlite3",
        connection: {
            filename: path.resolve(__dirname, "./ecommerce.sqlite"),
        },
    },
    mongodb: {
        connectTo: (database) =>
            `mongodb+srv://benjasarria:${process.env.DB_PASSWORD}@coderhouse-ecommerce.rogfv.mongodb.net/${database}?retryWrites=true&w=majority`,
    },
};
