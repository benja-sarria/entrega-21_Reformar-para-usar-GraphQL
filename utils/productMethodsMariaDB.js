const fs = require("fs");
const path = require("path");
const dbconfig = require("../db/config");

class Products {
    constructor(tableName, mariaDBConfig) {
        this.tableName = tableName;
        this.mariaDBConfig = mariaDBConfig;
    }

    async createFile() {
        const knex = require("knex")(this.mariaDBConfig.mariaDB);
        try {
            const tableExist = await knex.schema.hasTable(this.tableName);
            if (!tableExist) {
                await knex.schema.createTable(this.tableName, (table) => {
                    table.increments("id"); // id => primary key
                    table.string("title").notNullable();
                    table.integer("price").unsigned();
                    table.string("thumbnail").notNullable();
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
        const knex = require("knex")(this.mariaDBConfig.mariaDB);
        try {
            console.log(object);
            const tableExist = await knex.schema.hasTable(this.tableName);
            if (tableExist) {
                console.log("Añadiendo registro");

                await knex(this.tableName).insert(object);
            }
            const objectWithId = await knex
                .from(this.tableName)
                .select("id", "title", "price", "thumbnail")
                .where({
                    title: object.title,
                    price: object.price,
                    thumbnail: object.thumbnail,
                });
            return objectWithId;
        } catch (error) {
            throw new Error(error.message);
        } finally {
            knex.destroy();
        }
    }

    async updateProduct(id, propertiesToUpdate) {
        const knex = require("knex")(this.mariaDBConfig.mariaDB);
        try {
            const tableExist = await knex.schema.hasTable(this.tableName);

            if (tableExist) {
                const oldProduct = await knex
                    .from(this.tableName)
                    .select("*")
                    .where({
                        id: id,
                    });

                await knex
                    .from(this.tableName)
                    .where({ id: id })
                    .update({ ...propertiesToUpdate });
                console.table("Data updated");
                const updatedProduct = await knex
                    .from(this.tableName)
                    .select("*")
                    .where({
                        id: id,
                    });
                return { updatedProduct, oldVersion: oldProduct };
            }
        } catch (error) {
            throw new Error(error.message);
        } finally {
            knex.destroy();
        }
    }

    async getProductById(id) {
        const knex = require("knex")(this.mariaDBConfig.mariaDB);
        try {
            const tableExist = await knex.schema.hasTable(this.tableName);

            if (tableExist) {
                const searchedProduct = await knex
                    .from(this.tableName)
                    .select("*")
                    .where({
                        id: id,
                    });

                return searchedProduct;
            }
        } catch (error) {
            throw new Error(error.message);
        } finally {
            knex.destroy();
        }
    }

    async getAllProducts() {
        const knex = require("knex")(this.mariaDBConfig.mariaDB);
        try {
            const tableExist = await knex.schema.hasTable(this.tableName);

            if (tableExist) {
                const allProducts = await knex.from(this.tableName).select("*");
                return allProducts;
            }
        } catch (error) {
            throw new Error(error.message);
        } finally {
            knex.destroy();
        }
    }

    async deleteById(id) {
        console.log(id);
        console.log(typeof id);
        const knex = require("knex")(this.mariaDBConfig.mariaDB);
        try {
            const tableExist = await knex.schema.hasTable(this.tableName);

            if (tableExist) {
                const productToDelete = await knex
                    .from(this.tableName)
                    .where({ id: `${id}` });
                console.log(productToDelete.length > 0);
                if (productToDelete.length > 0) {
                    await knex.from(this.tableName).where({ id: id }).del();
                    console.table("Data erased!");
                } else {
                    const error = new Error();
                    error.message = "We couldn't find any product by that ID";
                    throw error;
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteAllProducts() {
        const knex = require("knex")(this.mariaDBConfig.mariaDB);
        try {
            const tableExist = await knex.schema.hasTable(this.tableName);

            if (tableExist) {
                await knex.from(this.tableName).del();
                console.table("Data erased!");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

exports.Products = Products;

/* const products = new Products("ecommerce", dbconfig);
products.createFile(); */
