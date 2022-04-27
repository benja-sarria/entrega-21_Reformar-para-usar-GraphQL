const express = require("express");
const { fork } = require("child_process");

const router = express.Router();

router.get("/", async (req, res) => {
    console.log(req.query);
    const operation = fork("./utils/calculate.js");
    operation.send(req.query.cant);
    operation.on("message", (data) => {
        res.json(data);
    });
});

module.exports = router;
