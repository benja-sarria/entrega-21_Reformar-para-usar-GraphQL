const createProducts = (quantity) => {
    const productsArray = [];
    /* for (let i = 1; i <= quantity; i += 1) {
        const newProduct = {
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: faker.image.abstract(null, null, true),
        };
        productsArray.push(newProduct);
    }
 */
    return productsArray;
};

module.exports = { createProducts };
