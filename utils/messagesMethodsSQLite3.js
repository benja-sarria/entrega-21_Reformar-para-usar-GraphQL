const path = require("path");
const moment = require("moment");
const mongoose = require("mongoose");
const dbconfig = require("../db/config");
const { MessagesModel } = require("../models/Messages");

class Messages {
    constructor(
        tableName = "",
        sqlite3Config = "",
        DB_PASSWORD = "",
        DATABASE = ""
    ) {
        this.tableName = tableName;
        this.sqlite3Config = sqlite3Config;
        this.DATABASE = DATABASE;
        this.DB_PASSWORD = DB_PASSWORD;
        this.DB_URI = `mongodb+srv://benjasarria:${this.DB_PASSWORD}@coderhouse-ecommerce.rogfv.mongodb.net/${this.DATABASE}?retryWrites=true&w=majority`;
        this.type = "messages";
    }

    /*  async createFile() {
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
    } */

    async saveMessage(object) {
        try {
            console.log(object);
            await mongoose.connect(this.DB_URI);
            console.log(`Database connected correctly!`);

            object.timestamp = moment().format("D/MM/YYYY hh:mm:ss");

            if (this.type === "products") {
                await MessagesModel.create(object);
                console.log("Message added correctly");
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            mongoose.disconnect();
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
            console.log(this.DB_PASSWORD);
            console.log(this.DATABASE);
            console.log("cargando todos los mensajes");
            /* const knex = require("knex")(this.sqlite3Config.sqlite);
            const tableExist = await knex.schema.hasTable(this.tableName);
            console.log(tableExist);
            if (tableExist) {
                const messages = await knex
                    .from(this.tableName)
                    .select("id", "email", "message", "time");

                return messages;
            } */

            await mongoose.connect(this.DB_URI);
            console.log(`Database connected correctly!`);

            const messages = await MessagesModel.find().lean();

            return messages;
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
