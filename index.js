const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const apiRoutes = require("./routers/index");
const { engine } = require("express-handlebars");
const path = require("path");
const dbconfig = require("./db/config");
const { Products } = require("./utils/productMethodsMariaDB");
const { Messages } = require("./utils/messagesMethodsSQLite3");
const createPersistanceTables = require("./utils/createPersistanceTables");

// Initialize tables
createPersistanceTables();

const app = express();

const PORT = process.env.PORT || 8080;
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

// Templates Engine
// HANDLEBARS
app.engine(
    "hbs",
    engine({
        // la extensión de los archivos
        extname: "hbs",
        defaultLayout: "main.hbs",
        // indicamos un path absoluto donde estan nuestros layouts y vistas principales
        layoutsDir: path.resolve(__dirname, "./views/layouts"),
        // path a nuestras vistas secundarias
        partialsDir: path.resolve(__dirname, "./views/partials"),
    })
);
app.set("views", "./views");
app.set("views engine", "hbs");

app.use(express.static("public"));

// Routes
app.use("/api", apiRoutes);

// GET
// HANDLEBARS
// /api/products/
app.get("/", async (req, res) => {
    res.render("index.hbs", {
        layout: "landing",

        customstyle: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">`,
        customStyleCss: "<link rel='stylesheet' href='../css/styles.css' />",
    });
});

// Listen
httpServer.listen(PORT, () => {
    console.log(`Server is up and running on port: `, PORT);
});

// IO EVENTS
io.on("connection", async (socket) => {
    console.log("New client connection!");
    const messages = new Messages("ecommerce", dbconfig);

    const allProducts = await new Products(
        "ecommerce",
        dbconfig
    ).getAllProducts();
    const formattedProducts = allProducts.map((product) => {
        return {
            ...product,
            price: new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
            }).format(product.price),
        };
    });
    socket.emit("products-list", formattedProducts);

    socket.on("product-added", async () => {
        setTimeout(async () => {
            const allProducts = await new Products(
                "ecommerce",
                dbconfig
            ).getAllProducts();
            const formattedProducts = allProducts.map((product) => {
                return {
                    ...product,
                    price: new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                    }).format(product.price),
                };
            });
            socket.broadcast.emit(
                "update-list",
                formattedProducts[formattedProducts.length - 1]
            );
        }, 2000);
    });
    const allMessages = await messages.getAllMessages();
    socket.emit("messages-list", allMessages);
    socket.on("new-message", async ({ email, message }) => {
        await messages.save({ email, message });
        const knex = require("knex")(dbconfig.sqlite);
        const newMessage = await knex.from("ecommerce").select("*").where({
            email: email,
            message: message,
        });

        io.emit("update-messages-list", newMessage[0]);
    });
});
