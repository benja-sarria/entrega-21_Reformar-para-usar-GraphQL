const express = require("express");
const productsInstance = require("../../middlewares/productInstance");
const { Products } = require("../../utils/productMethods");
const path = require("path");

const router = express.Router();

// Middlewares
router.use(productsInstance);

// Routes

// GET
// HANDLEBARS
// /api/products/
router.get("/", async (req, res) => {
    const allProducts = await req.products.getAllProducts();
    const formattedProducts = allProducts.map((product) => {
        return {
            ...product,
            price: new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
            }).format(product.price),
        };
    });
    res.render("index.hbs", {
        formattedProducts,
        customstyle: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">`,
        customStyleCss: "<link rel='stylesheet' href='../css/styles.css' />",
    });
});

// GET
router.get("/:id", async (req, res) => {
    try {
        console.log(req.query);
        let notANumericalID = false;
        if (!+req.params.id && !+req.query.getProductById) {
            const error = new Error();
            error.message =
                "You have to provide a numerical ID for the product";
            res.json({
                error: error.message,
            });
            notANumericalID = true;
        }

        if (!notANumericalID) {
            const id = +req.params.id
                ? req.params.id
                : +req.query.getProductById;

            res.json(
                (await req.products.getProductById(+id))
                    ? await req.products.getProductById(+id)
                    : {
                          error: "We couldn't find any product with that ID",
                      }
            );
        }
    } catch (error) {
        throw new Error(error.message);
    }
});

// POST
router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        let propertyMissing = false;
        if (!req.body.title || !req.body.price || !req.body.thumbnail) {
            const error = new Error();
            error.message =
                "You have to provide an Object with the following properties in order to add a Product: title, price and thumbnail";
            res.status(400).json({
                error: error.message,
            });
            propertyMissing = true;
        }

        if (!propertyMissing) {
            const productToAdd = req.body;
            const addedProduct = await req.products.save(productToAdd);

            setTimeout(() => {
                res.redirect("/");
            }, 2000);
        }
    } catch (error) {
        throw new Error(error.message);
    }
});

// PUT
router.put("/:id", async (req, res) => {
    try {
        if (!req.params.id || !+req.params.id) {
            const error = new Error();
            error.message =
                "You have to provide a valid numerical id in order to update a product";
            res.status(400).json({
                error: error.message,
            });
            throw error;
        }
        const bodyKeys = Object.keys(req.body);
        let hasWrongKeys = false;
        bodyKeys.forEach((key) => {
            if (
                key !== "title" &&
                key !== "price" &&
                key !== "thumbnail" &&
                key !== "updateTitle" &&
                key !== "updatePrice" &&
                key !== "updateThumbnail" &&
                key !== "updateId"
            ) {
                const error = new Error();
                error.message =
                    "You can only update the following fields: title, price, thumbnail";
                res.status(400).json({
                    error: error.message,
                });
                hasWrongKeys = true;
            }
        });
        if (!hasWrongKeys) {
            if (req.body.updateId) {
                const parsedBody = {};
                bodyKeys.forEach((key) => {
                    if (key !== "updateId") {
                        const parsedKey = `${key.slice(6, 7).toLowerCase()}${key
                            .slice(7, key.length)
                            .toLowerCase()}`;
                        parsedBody[parsedKey] = req.body[key];
                    }
                });
                const updatedProduct = await req.products.updateProduct(
                    +req.params.id,

                    parsedBody
                );
                res.json(updatedProduct);
            } else {
                const updatedProduct = await req.products.updateProduct(
                    +req.params.id,
                    req.body
                );
                res.json(updatedProduct);
            }
        }
    } catch (error) {
        throw new Error(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let notANumericalID = false;
        if (!+req.params.id) {
            const error = new Error();
            error.message =
                "You have to provide a numerical ID to eliminate a product";
            res.json({
                error: error.message,
            });
            notANumericalID = true;
        }
        const id = +req.params.id;

        if (!notANumericalID) {
            res.json(
                (await req.products.deleteById(+id))
                    ? { error: await req.products.deleteById(+id) }
                    : {
                          success: "The product was deleted successfully",
                      }
            );
        }
    } catch (error) {
        throw new Error(error.message);
    }
});

module.exports = router;
