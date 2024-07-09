import { Schema, model } from "mongoose";

const ticketColletction = 'ticket'
const ticketSchema = new Schema({
    code: {
        type: String,
        require: true,
    },
    purchase_datetime:{
        type: Date,
        default: Date.now
    },
    amount:{
        type: Number,
        default:0,
        require: true
    },
    purchaser:  {
        type: String,
        default:'mail',
        require:true
    }
})

export const ticketModel = model(ticketColletction,ticketSchema)