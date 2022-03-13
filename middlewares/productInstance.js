const { Messages } = require("../utils/messagesMethodsSQLite3");
const { Products } = require("../utils/productMethods");
const dbconfig = require("../db/config");

const productsInstance = (req, res, next) => {
    const products = new Products("products.json");
    const messages = new Messages("ecommerce", dbconfig);

    req.products = products;
    req.messages = messages;
    next();
};

module.exports = productsInstance;
