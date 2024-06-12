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
        enum:['user', 'premium-user', 'admin'] ,
        default: 'user'
    },
    cartID:{
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})

export const userModel = model(userCollection, userSchema)