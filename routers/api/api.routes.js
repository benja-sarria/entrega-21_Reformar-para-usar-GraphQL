const express = require("express");
const authRoutes = require("./auth/auth.routes");

const router = express.Router();

// Middlewares

//Routes
router.use("/auth", authRoutes);

module.exports = router;
