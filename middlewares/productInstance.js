const { Messages } = require("../utils/messagesMethodsSQLite3");
// const { Products } = require("../utils/productMethodsMariaDB");
const dbconfig = require("../db/config");

const productsInstance = (req, res, next) => {
    // const products = new Products("ecommerce", dbconfig);
    const messages = new Messages("ecommerce", dbconfig);
    // products.createFile();
    messages.createFile();
    // req.products = products;
    req.messages = messages;
    next();
};

module.exports = productsInstance;
