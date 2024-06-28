import { Router } from "express";
import ChatController from "../../controllers/chat.controller.js";

const router = Router();
const {
    getMessage,
    createMessage
} = new ChatController()
router.get('/chat', getMessage);

router.post('/chat', createMessage);

export default router;