const express = require("express");
const productRoutes = require("./products/products.routes");
const randomsRoutes = require("./randoms/randoms.routes");
const authControllers = require("../controllers/auth.controllers");
const passport = require("../middlewares/passport");
const auth = require("../middlewares/auth");

const router = express.Router();

// Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Routes
router.use("/products", productRoutes);
router.use("/randoms", randomsRoutes);

router.post(
    "/register",
    passport.authenticate("register", { failureRedirect: "/register-error" }),
    authControllers.register
);
router.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/login-error" }),
    authControllers.login
);

router.get("/logout", auth, (req, res, next) => {
    /*  req.session.destroy((err) => {
        if (err) {
            next(err);
        } else {
            res.clearCookie("coder-session");
            res.redirect("/");
        }
    }); */
    req.logout();
    console.log("User logged out");
    res.redirect("/");
});

module.exports = router;
