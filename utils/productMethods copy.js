const fs = require("fs");
const path = require("path");

class Products {
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
                `${path.resolve(__dirname, "../data")}/${this.fileName}`
            );

            if (!fileExists) {
                console.log("creando el archivo");
                const objectWithId = {
                    ...object,
                    id: 1,
                };
                console.log(`[${JSON.stringify(objectWithId)}]`);
                fs.writeFile(
                    `${path.resolve(__dirname, "../data")}/${this.fileName}`,
                    `[{}]`,
                    (error) => {
                        if (error) {
                            console.log(error.message);
                        } else {
                            console.log("archivo creado exitosamente");
                        }
                    }
                );

                console.log(objectWithId);
                return objectWithId;
            } else {
                console.log("escribiendo en archivo");
                console.log(require("../data/products.json"));
                const json = require("../data/products.json");

                let actualIds = [];

                json.forEach((product) => {
                    actualIds.push(product.id);
                });
                const sortedIds = actualIds.sort((a, b) => {
                    return a - b;
                });

                let isMissing = false;

                for (let i = 1; i <= sortedIds[sortedIds.length - 1]; i += 1) {
                    if (
                        (actualIds.indexOf(i) === -1 && !isMissing) ||
                        sortedIds[sortedIds.length - 1] === json.length + 1
                    ) {
                        isMissing = true;
                    }
                }

                if (isMissing) {
                    let missingId;
                    for (
                        let i = 1;
                        i <= sortedIds[sortedIds.length - 1];
                        i += 1
                    ) {
                        if (actualIds.indexOf(i) === -1) {
                            if (!missingId) {
                                missingId = i;
                            } else if (i < missingId) {
                                missingId = i;
                            }
                        }
                    }
                    const objectWithId = {
                        ...object,
                        id: missingId,
                    };

                    json.push(objectWithId);
                    const parsedJson = JSON.stringify(json);
                    fs.writeFile(
                        `${path.resolve(__dirname, "../data")}/${
                            this.fileName
                        }`,
                        `${parsedJson}`,
                        (error) => {
                            if (error) {
                                console.log(error.message);
                            } else {
                                console.log("Producto añadido exitosamente");
                            }
                        }
                    );
                    console.log(json);
                    return objectWithId;
                }

                const objectWithId = {
                    ...object,
                    id: json.length + 1,
                };

                json.push(objectWithId);
                const parsedJson = JSON.stringify(json);
                fs.writeFile(
                    `${path.resolve(__dirname, "../data")}/${this.fileName}`,
                    `${parsedJson}`,
                    (error) => {
                        if (error) {
                            console.log(error.message);
                        } else {
                            console.log("Producto añadido exitosamente");
                        }
                    }
                );
                console.log(json);
                return objectWithId;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProduct(id, propertiesToUpdate) {
        const json = require("../data/products.json");

        const productToUpdate = await this.getProductById(id);
        const updatedProduct = { ...productToUpdate, ...propertiesToUpdate };
        const updatedJson = json.map((product) => {
            if (product.id === id) {
                return updatedProduct;
            } else {
                return product;
            }
        });

        const parsedJson = JSON.stringify(updatedJson);
        fs.writeFile(
            `${path.resolve(__dirname, "../data")}/${this.fileName}`,
            `${parsedJson}`,
            (error) => {
                if (error) {
                    console.log(error.message);
                } else {
                    console.log("Producto modificado exitosamente");
                }
            }
        );
        return { updatedProduct, oldVersion: productToUpdate };
    }

    async getProductById(id) {
        try {
            const json = require("../data/products.json");

            const filteredJson = json.filter((product) => product.id === id);

            if (!filteredJson.length) {
                return null;
            }

            return filteredJson[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllProducts() {
        try {
            const json = require("../data/products.json");

            if (!json.length) {
                const error = new Error();
                error.message =
                    "There aren't any products saved in our DataBase";
                throw error;
            }

            return json;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteById(id) {
        try {
            const json = require("../data/products.json");
            const filteredProduct = json.filter((product) => product.id === id);

            if (!filteredProduct.length) {
                const error = new Error();
                error.message =
                    "We couldn't find any product with that ID in our DataBase";
                return error.message;
            }

            const filteredJson = json.filter((product) => product.id !== id);

            const parsedJson = JSON.stringify(filteredJson);

            await fs.writeFile(
                `${path.resolve(__dirname, "../data")}/${this.fileName}`,
                `${parsedJson}`,
                (error) => {
                    if (error) {
                        console.log(error.message);
                    } else {
                        console.log("Archivo eliminado exitosamente");
                    }
                }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteAllProducts() {
        try {
            const json = require("../data/products.json");

            if (!json.length) {
                const error = new Error();
                error.message = "We couldn't find any products on our DataBase";
                throw error;
            }

            const wipedOutJson = [];

            const parsedJson = JSON.stringify(wipedOutJson);

            await fs.writeFile(
                `${path.resolve(__dirname, "../data")}/${this.fileName}`,
                `${parsedJson}`,
                (error) => {
                    if (error) {
                        console.log(error.message);
                    } else {
                        console.log("Archivos eliminados exitosamente");
                    }
                }
            );
            console.log(wipedOutJson);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

exports.Products = Products;
