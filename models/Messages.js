const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const collection = "messages";

const MessagesSchema = new Schema({
    author: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: String, required: true },
        alias: { type: String, required: true },
        avatar: { type: String, required: true },
    },
    text: { type: String, required: true },
    timestamp: { type: String },
});

const MessagesModel = mongoose.model(collection, MessagesSchema);

module.exports = { MessagesModel };
