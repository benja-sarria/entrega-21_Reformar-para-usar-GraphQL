const { Messages } = require("./messagesMethodsSQLite3");
const { Products } = require("./productMethodsMariaDB");
const dbconfig = require("../db/config");

const createPersistanceTables = () => {
    const products = new Products("ecommerce", dbconfig);
    const messages = new Messages("ecommerce", dbconfig);
    /* products.createFile();
    messages.createFile(); */
};

module.exports = createPersistanceTables;
