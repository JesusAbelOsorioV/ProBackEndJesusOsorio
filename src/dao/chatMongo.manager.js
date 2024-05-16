import { chatModel } from "../models/chat.model.js";

export default class ChatManager{
    constructor(){
        this.chatModel = chatModel
    }
    async getChat(){
        return await chatModel.find();
    }

    async create(data){
        const chat = await chatModel.create(data);
        console.log(`Mensage guardado`);
        return chat;
    }
}