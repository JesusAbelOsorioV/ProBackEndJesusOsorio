import { chatModel } from "../models/chat.model.js";

export default class ChatManager{
    static get(){
        return chatModel.find();
    }

    static async create(data){
        const chat = await chatModel.create(data);
        console.log(`Mensage guardado`);
        return chat;
    }
}