import { chatService } from "../service/service.js";
class ChatController {
    constructor(){
        this.chatService = chatService
    }
        getMessage = async (req, res) =>{
            const chat = await chatService.getChat()
           res.render('chat', chat);
       }
        createMessage = async (req, res) =>{
            const {user, message} = req.body;
           const newMsj= await chatService.create(user, message)
            res.status(201).json(newMsj);
        }
}

export default ChatController