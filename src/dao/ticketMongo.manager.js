import ticketModel from '../models/tickets.model.js'

class TicketsManager{
    constructor(){
        this.ticketModel = ticketModel;
    }
    async getTicketBy (filter){
        return ticketModel.findOne(filter)
    }

    async createTicket(data){
        return await this.ticketModel.create(data)
    }

    async delateTicket(filter){
        return await ticketModel.deleteOne(filter)
    }
}

export default TicketsManager;