const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const apiRoutes = require("./routers/index");
const { engine } = require("express-handlebars");
const path = require("path");
const dbconfig = require("./db/config");
// const { Products } = require("./utils/productMethodsMariaDB");
const { Messages } = require("./utils/messagesMethodsSQLite3");
const mongoose = require("mongoose");
const createPersistanceTables = require("./utils/createPersistanceTables");
const { normalize, schema } = require("normalizr");
const util = require("util");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const auth = require("./middlewares/auth");
const passport = require("./middlewares/passport");
const minimist = require("minimist");
const compression = require("compression");
const { logger } = require("./logger/index");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { getUser, updateUser, createUser, deleteUser } = require("./resolvers");

dotenv.config();

// Initialize tables
createPersistanceTables();

const app = express();

const args = minimist(process.argv.slice(2), {
    alias: {
        p: "PORT",
    },
});
const PORT = process.env.PORT || args.PORT || 8080;
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

const graphQLSchema = buildSchema(`
    type User {
        id: ID!
        firstname: String!,
        lastname: String!,
        birthdate: String!,
        age: Int!,
        email: String!,
        password: String!,
        createdAt: String! ,
        updatedAt: String!,
    }

    input UserInput {
        firstname: String,
        lastname: String,
        birthdate: String,
        age: Int,
        email: String,
        password: String,
    }

    type Query {
        getUsers: [User],
        getUser(id: ID!): User
    }

    type Mutation {
        createUser(data: UserInput): User,
        updateUser(id: ID!, data: UserInput): User,
        deleteUser(id: ID!): User,
    }
`);

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

// Middlewares
app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphQLSchema,
        rootValue: { getUser, updateUser, createUser, deleteUser },
        graphiql: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
    session({
        name: "my-session",
        secret: "top-secret-51",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://benjasarria:${process.env.DB_PASSWORD}@coderhouse-ecommerce.rogfv.mongodb.net/${process.env.SESSION_DB}?retryWrites=true&w=majority`,
        }),
        cookie: {
            maxAge: 600000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", apiRoutes);

// GET
// HANDLEBARS
// /api/products/
app.get("/", auth, async (req, res) => {
    const user = await req.user;
    logger.info(`[${req.method}] => ${req.path}`);
    console.log(user);

    res.render("index.hbs", {
        layout: "landing",
        currentUser: user,
        customstyle: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">`,
        customStyleCss: "<link rel='stylesheet' href='../css/styles.css' />",
    });
});

app.get("/login", async (req, res) => {
    logger.info(`[${req.method}] => ${req.path}`);
    mongoose.connect(dbconfig.mongodb.connectTo("demo_pb_25")).then(() => {
        console.log("Connected to DB!");
        console.log("Server is up and running on port: ", +PORT);
    });
    res.sendFile(path.join(__dirname + "/public/login.html"));
});
app.get("/register", async (req, res) => {
    logger.info(`[${req.method}] => ${req.path}`);
    res.sendFile(path.join(__dirname + "/public/register.html"));
});
app.get("/login-error", async (req, res) => {
    logger.info(`[${req.method}] => ${req.path}`);
    res.sendFile(path.join(__dirname + "/public/login-error.html"));
});
app.get("/register-error", async (req, res) => {
    logger.info(`[${req.method}] => ${req.path}`);
    res.sendFile(path.join(__dirname + "/public/register-error.html"));
});

app.get("/info", compression(), (req, res) => {
    logger.info(`[${req.method}] => ${req.path}`);
    console.log("Bloqueando el proceso");
    console.log("Bloqueando el proceso");
    console.log("Bloqueando el proceso");

    res.json({
        entryArguments: args,
        platformName: process.platform,
        nodeVersion: process.version,
        rssMemory: process.memoryUsage().rss,
        execPath: process.execPath,
        processId: process.pid,
        projectFolder: process.cwd(),
    });
});

/* app.post("/login", (req, res) => {
    const { name, email } = req.body;
    const user = {
        name: name,
        email: email,
    };
    req.session.user = user;
    req.session.save((error) => {
        if (error) {
            console.log(`Hubo un error de sesión: ${error}`);
            res.redirect("/login");
        }
        res.redirect("/");
    });
});
 */
/* app.get("/logout", auth, async (req, res) => {
    try {
        await fs.writeFile("./data/users.json", JSON.stringify(users));
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.clearCookie("my-session");
            } else {
                res.clearCookie("my-session");
                res.redirect("/");
            }
        });
    } catch (err) {
        console.log(err);
    }
}); */

app.get("/api/products/products-test", async (req, res) => {
    logger.info(`[${req.method}] => ${req.path}`);
    res.render("index.hbs", {
        layout: "landing",

        customstyle: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">`,
        customStyleCss: "<link rel='stylesheet' href='../css/styles.css' />",
    });
});

// Listen
httpServer.listen(PORT, () => {
    mongoose.connect(dbconfig.mongodb.connectTo("demo_pb_25")).then(() => {
        console.log("Connected to DB!");
        console.log("Server is up and running on port: ", +PORT);
    });
});

// IO EVENTS
io.on("connection", async (socket) => {
    console.log("New client connection!");
    const messages = new Messages(
        null,
        null,
        process.env.DB_PASSWORD,
        process.env.DATABASE
    );

    /* const allProducts = await new Products(
        "ecommerce",
        dbconfig
    ).getAllProducts(); */
    const formattedProducts = /* allProducts.map((product) => {
        return {
            ...product,
            price: new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
            }).format(product.price),
        };
    }) */ [];
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
    const messagesObject = {
        id: "messagesObj",
        messages: [...allMessages],
    };

    // Author schema:
    const authorSchema = new schema.Entity("author");

    const messageSchema = new schema.Entity(
        "message",
        {
            author: authorSchema,
        },
        { idAttribute: "_id" }
    );
    // messages schema:
    const messagesSchema = new schema.Entity("messages", {
        messages: [messageSchema],
    });
    const normalizedMessages = normalize(messagesObject, messagesSchema);
    if (!normalizedMessages) {
        const error = new Error();
        error.message = "There has been an error";
        logger.error(`[error] => ${error.message}`);
    }
    socket.emit("messages-list", normalizedMessages);
    socket.on("new-message", async ({ email, message }) => {
        await messages.saveMessage({ email, message });
        await mongoose.disconnect();
        await mongoose.connect(
            `mongodb+srv://benjasarria:${process.env.DB_PASSWORD}@coderhouse-ecommerce.rogfv.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`
        );
        console.log(`Database connected correctly!`);

        const newMessage = await MessagesModel.find({
            author: {
                id: email,
            },
            text: message,
        });

        /*  const knex = require("knex")(dbconfig.sqlite);
        const newMessage = await knex.from("ecommerce").select("*").where({
            email: email,
            message: message,
        }); */

        io.emit("update-messages-list", newMessage[0]);
    });
});

app.get("*", (req, res) => {
    logger.warn(`[${req.method}] => ${req.path}`);
    res.send({
        error: "route doesn't exist",
    });
});
