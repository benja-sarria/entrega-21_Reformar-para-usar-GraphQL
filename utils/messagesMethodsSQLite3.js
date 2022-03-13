const path = require("path");
const moment = require("moment");
const dbconfig = require("../db/config");

class Messages {
    constructor(tableName, sqlite3Config) {
        this.tableName = tableName;
        this.sqlite3Config = sqlite3Config;
    }

    async createFile() {
        const knex = require("knex")(this.sqlite3Config.sqlite);
        try {
            const tableExist = await knex.schema.hasTable(this.tableName);
            if (!tableExist) {
                await knex.schema.createTable(this.tableName, (table) => {
                    table.increments("id"); // id => primary key
                    table.string("email").notNullable();
                    table.string("message").notNullable();
                    table.string("time").notNullable();
                });
                console.log("Table created!");
            } else {
                console.log("Skipping creation...");
            }
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            knex.destroy();
        }
    }

    async save(object) {
        try {
            const knex = require("knex")(this.sqlite3Config.sqlite);
            console.log(object);
            console.log("Añadiendo registro");
            object.time = `[${moment().format("D/MM/YYYY hh:mm:ss")}]`;

            await knex(this.tableName).insert(object);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllMessages() {
        try {
            console.log("cargando todos los mensajes");
            const knex = require("knex")(this.sqlite3Config.sqlite);
            const tableExist = await knex.schema.hasTable(this.tableName);
            console.log(tableExist);
            if (tableExist) {
                const messages = await knex
                    .from(this.tableName)
                    .select("id", "email", "message", "time");

                console.log(messages);
                return messages;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

exports.Messages = Messages;

/* (async () => {
    const knex = require("knex")(dbconfig.sqlite);
    await knex.from("ecommerce").del();
    console.table("Data erased!");
})();
 */
