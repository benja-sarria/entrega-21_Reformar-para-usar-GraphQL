const { Messages } = require("../utils/messagesMethods");
const { Products } = require("../utils/productMethods");

const productsInstance = (req, res, next) => {
    const products = new Products("products.json");
    const messages = new Messages("messages.json");

    req.products = products;
    req.messages = messages;
    next();
};

module.exports = productsInstance;
