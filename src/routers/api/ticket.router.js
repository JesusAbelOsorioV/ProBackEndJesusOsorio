import { Router } from "express";
import TicketController from "../../controllers/ticket.controller.js";

const router = Router()

const {
    getTicket,
    delateTicket
}= new TicketController()

router.get('/ticket/:tid', getTicket)
router.get('/ticket/:tid', delateTicket)

export default router