const socket = io("http://localhost:8080");
const tableContainer = document.getElementById("table-container");
const createProdBtn = document.getElementById("create-product-btn");
const sendMsgBtn = document.getElementById("send-message-btn");
const msgEmail = document.getElementById("message-email");
const msgText = document.getElementById("message-text");
const msgsContainer = document.getElementById("messages-container");
const productNameInput = document.getElementById("nombre");
const productPriceInput = document.getElementById("precio");
const productThumbnailInput = document.getElementById("thumbnail");

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

socket.on("connection", (data) => {
    console.log("connected");
});

socket.on("products-list", (data) => {
    console.log("actualizando lista");
    console.log(data);
    console.log(!document.querySelector(".products-table"));
    if (document.querySelector(".products-table")) {
        document.querySelector(".products-table").remove();
    }
    if (!document.querySelector(".products-table")) {
        console.log(data);
        const table = document.createElement("table");
        table.classList.add("table");
        table.classList.add("products-table");
        table.classList.add("table-hover");
        const tableHeaders = document.createElement("tr");
        for (let i = 0; i <= 2; i += 1) {
            const tableHeader = document.createElement("th");
            tableHeader.classList.add("fs-4");
            if (i === 0) {
                tableHeader.textContent = "Producto";
            } else if (i === 1) {
                tableHeader.textContent = "Precio";
            } else if (i === 2) {
                tableHeader.textContent = "Imagen";
            }
            tableHeaders.appendChild(tableHeader);
            console.log(tableHeaders);
        }
        table.appendChild(tableHeaders);
        tableContainer.appendChild(table);

        data.forEach((product) => {
            const row = document.createElement("tr");
            const productName = document.createElement("td");
            productName.textContent = `${product.title}`;
            const productPrice = document.createElement("td");
            productPrice.textContent = `${product.price}`;
            const productImg = document.createElement("td");
            const img = document.createElement("img");
            img.src = `${product.thumbnail}`;
            productImg.appendChild(img);
            row.appendChild(productName);
            row.appendChild(productPrice);
            row.appendChild(productImg);
            table.appendChild(row);
        });
    }
});

createProdBtn.addEventListener("click", () => {
    socket.emit("product-added");
});

socket.on("update-list", (data) => {
    const table = document.querySelector("table");
    const row = document.createElement("tr");
    const productName = document.createElement("td");
    productName.textContent = `${data.title}`;
    const productPrice = document.createElement("td");
    productPrice.textContent = `${data.price}`;
    const productImg = document.createElement("td");
    const img = document.createElement("img");
    img.src = `${data.thumbnail}`;
    productImg.appendChild(img);
    row.appendChild(productName);
    row.appendChild(productPrice);
    row.appendChild(productImg);
    table.appendChild(row);
    productNameInput.value = "";
    productPriceInput.value = "";
    productThumbnailInput.value = "";
});

sendMsgBtn.addEventListener("click", () => {
    if (!validateEmail(msgEmail.value)) {
        msgEmail.classList.add("is-invalid");
        msgEmail.value = "";
    } else if (msgText.value === "") {
        msgText.classList.add("is-invalid");
    } else {
        msgEmail.classList.remove("is-invalid");
        msgText.classList.remove("is-invalid");
        const message = {
            email: msgEmail.value,
            message: msgText.value,
        };

        socket.emit("new-message", message);
        msgEmail.value = "";
        msgText.value = "";
    }
});

socket.on("messages-list", (data) => {
    msgsContainer.innerHTML = "";
    console.log(normalizr);
    console.log(data);
    // Author schema:
    const authorSchema = new normalizr.schema.Entity("author");

    const messageSchema = new normalizr.schema.Entity(
        "message",
        {
            author: authorSchema,
        },
        { idAttribute: "_id" }
    );
    // messages schema:
    const messagesSchema = new normalizr.schema.Entity("messages", {
        messages: [messageSchema],
    });

    const denormalizedMessages = normalizr.denormalize(
        data.result,
        messagesSchema,
        data.entities
    );

    console.log(denormalizedMessages);

    console.log(
        `PESO SIN NORMALIZAR => ${JSON.stringify(denormalizedMessages).length}`
    );
    console.log(`PESO NORMALIZADO => ${JSON.stringify(data).length}`);

    if (msgsContainer.children.length === 0) {
        denormalizedMessages.messages.forEach((message) => {
            console.log(message);
            console.log(message.author);
            const tr = document.createElement("tr");
            const emailCell = document.createElement("td");
            emailCell.classList.add("email-cell");
            const messageCell = document.createElement("td");
            messageCell.classList.add("message-cell");
            const timestampCell = document.createElement("td");
            timestampCell.classList.add("timestamp-cell");
            emailCell.textContent = message.author.id;
            messageCell.textContent = message.text;
            timestampCell.textContent = `${message.timestamp}:`;

            tr.appendChild(emailCell);
            tr.appendChild(timestampCell);
            tr.appendChild(messageCell);
            msgsContainer.appendChild(tr);
        });
    }
});

socket.on("update-messages-list", (data) => {
    const tr = document.createElement("tr");
    const emailCell = document.createElement("td");
    emailCell.classList.add("email-cell");
    const messageCell = document.createElement("td");
    messageCell.classList.add("message-cell");
    const timestampCell = document.createElement("td");
    timestampCell.classList.add("timestamp-cell");

    emailCell.textContent = data.email;
    messageCell.textContent = data.message;
    timestampCell.textContent = `${data.time}:`;

    tr.appendChild(emailCell);
    tr.appendChild(timestampCell);
    tr.appendChild(messageCell);
    msgsContainer.appendChild(tr);
});
