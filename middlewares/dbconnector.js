/* const { default: mongoose } = require("mongoose");
const dbconfig = require("../db/config");

const dbconnector = (req, res, next) => {
    mongoose.connect(dbconfig.mongodb.connectTo("demo_pb_25")).then(() => {
        console.log("Connected to DB!");
        console.log("Server is up and running on port: ", +PORT);
    });
    next();
};

module.exports = dbconnector;
 */
