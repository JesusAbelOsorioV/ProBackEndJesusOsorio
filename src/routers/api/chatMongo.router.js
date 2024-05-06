import { Router } from "express";
import ChatManager from "../../dao/chatMongo.manager.js";
import {newMessageFromDB} from '../../app.js'

const router = Router();

router.get('/chat', async (req, res) =>{
    // const chat = await ChatManager.get();
    res.render('chat');
});

router.post('/chat', async (req, res) =>{
    const {body} = req;
   newMessageFromDB = await ChatManager.create(body);
    res.status(201).json(newMessageFromDB);
});

export default router;