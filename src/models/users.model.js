import { Schema, model } from "mongoose";

const userCollection ='users'
const userSchema = new Schema({
    first_name:{
        type: String,
        index: true
    },
    last_name: String,
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: Number,
    password: String,
    role:{
        type: String,
        enum:['user', 'premium', 'admin'] ,
        default: 'user'
    },
    cart:{
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    documents: {
        type: [{
            name: {
                type: String,
            },
            reference: {
                type: String
            }
        }]
    },
    last_connection: String 
})

export const userModel = model(userCollection, userSchema)