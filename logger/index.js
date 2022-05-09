const winston = require("winston");

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console({
            level: "info",
        }),
        new winston.transports.File({
            level: "warn",
            filename: "./logger/logs/warn.log",
        }),
        new winston.transports.File({
            level: "error",
            filename: "./logger/logs/error.log",
        }),
    ],
    format: winston.format.combine(
        winston.format.colorize({
            all: true,
            colors: {
                info: "blue",
                warn: "yellow",
                error: "red",
            },
        }),
        winston.format.align(),
        winston.format.timestamp(),
        winston.format.printf(
            (info) => `${info.timestamp} [${info.level}] => ${info.message}`
        )
    ),
});

module.exports = {
    logger,
};
