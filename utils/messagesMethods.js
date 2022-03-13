const fs = require("fs");
const path = require("path");
const moment = require("moment");

class Messages {
    constructor(fileName) {
        this.fileName = fileName;
    }

    async createFile() {
        fs.writeFile(`${__dirname}/${this.fileName}`, "[]", (error) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log("archivo creado exitosamente");
            }
        });
    }

    async save(object) {
        try {
            console.log(object);

            const fileExists = fs.existsSync(
                `${path.resolve(__dirname, "../db")}/${this.fileName}`
            );

            if (!fileExists) {
                console.log("creando el archivo");

                fs.writeFile(
                    `${path.resolve(__dirname, "../db")}/${this.fileName}`,
                    `[{}]`,
                    (error) => {
                        if (error) {
                            console.log(error.message);
                        } else {
                            console.log("archivo creado exitosamente");
                        }
                    }
                );
            } else {
                console.log("escribiendo en archivo");
                console.log(require("../db/messages.json"));
                const json = require("../db/messages.json");
                object.time = `[${moment().format("D/MM/YYYY hh:mm:ss")}]`;
                json.push(object);
                const parsedJson = JSON.stringify(json);

                fs.writeFile(
                    `${path.resolve(__dirname, "../db")}/${this.fileName}`,
                    `${parsedJson}`,
                    (error) => {
                        if (error) {
                            console.log(error.message);
                        } else {
                            console.log("Mensaje guardado exitosamente");
                        }
                    }
                );
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllMessages() {
        try {
            const json = require("../db/messages.json");

            return json;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

exports.Messages = Messages;
