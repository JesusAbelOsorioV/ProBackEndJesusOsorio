import { ticketService, cartService, userService } from "../service/service.js";

export class TicketController{
    constructor(){
        this.ticketService = ticketService;
        this.cartService = cartService;
        this.userService = userService;
    }

    createTicket = async (data)=>{
        const {cartId, userId, totalA} = data;
        const cart = await this.cartService.getCartBy({ _id: cartId})
        const user = await this.userService.getUserBy({ _id: userId})

        if(!cart || !user){
            return send({status: 'error', error: 'carrito o usuario no encontrado'})
        }

        const newTicket ={
            code: Math.random().toString(36).substring(2, 9).toUpperCase,
            purchase_datetime: new Date(),
            amount: totalA,
            purcahser: user.email
        }

        const crearTicket = await this.ticketService.createTicket(newTicket)
        return crearTicket
    }

    getTicket = async (req, res) =>{
        const { tid } = req.params
        const ticketFound = await ticketService.getTicketBy({_id: tid})
        if(!ticketFound) return res.status(400).send({status: 'error', error: `No existe ningun ticket con id: ${tid}`})
            res.status(200).send({status: 'success', payload: ticketFound})
    }
    delateTicket = async (req, res)=>{
        const { tid } = req.params
        const ticketFound = await ticketService.getTicketBy({ _id: tid})
        if(!ticketFound) return res.status(400).send({status: 'error', error: `No existe ningun ticket con id: ${tid}`})
            res.status(200).send({status: 'success', payload: ticketFound})
        ticketService.delateTicket(tid)
    }
}
