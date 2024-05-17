import { Schema, model } from "mongoose";

const chatCollection = 'messages'

const chatSchema = new Schema({
    user: String,
    message: {
        type: String,
        require: true
    }
});

export const chatModel = model(chatCollection, chatSchema);

