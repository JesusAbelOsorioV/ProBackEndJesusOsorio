import { Router } from "express";
import ChatManager from "../../dao/chatMongo.manager.js";


const router = Router();

const chatServise = new ChatManager

router.get('/chat', async (req, res) =>{
     const chat = await chatServise.getChat()
    res.render('chat', chat);
});

router.post('/chat', async (req, res) =>{
    const {user, message} = req.body;
   const newMsj= await chatServise.create(user, message)
    res.status(201).json(newMsj);
});

export default router;