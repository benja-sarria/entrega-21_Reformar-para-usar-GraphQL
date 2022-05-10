const express = require("express");
const compression = require("compression");
const { fork } = require("child_process");
const { logger } = require("../../logger/index");

const router = express.Router();

router.get("/", compression, async (req, res) => {
    /*  logger.info(`[${req.method}] => ${req.path}`);
    console.log(req.query);
    const operation = fork("./utils/calculate.js");
    operation.send(req.query.cant);
    operation.on("message", (data) => {
        res.json(data);
    }); */
});

module.exports = router;
