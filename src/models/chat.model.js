import { Schema, model } from "mongoose";

const chatCollection = 'messages'

const chatSchema = new Schema({
    user: String,
    message: String
});

export const chatModel = model(chatCollection, chatSchema);

