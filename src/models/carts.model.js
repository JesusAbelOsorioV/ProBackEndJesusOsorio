import { Schema, model } from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = new Schema({
    produts: []
})

const cartModel = model(cartsCollection, cartsSchema);

export default cartModel;