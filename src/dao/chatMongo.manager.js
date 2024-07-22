import { chatModel } from "../models/chat.model.js";
import { logger } from "../utils/logger.js";

export default class ChatManager{
    constructor(){
        this.chatModel = chatModel
    }
    async getChat(){
        return await chatModel.find();
    }

    async create(data){
        const chat = await chatModel.create(data);
        logger.info(`Mensage guardado`);
        return chat;
    }
}