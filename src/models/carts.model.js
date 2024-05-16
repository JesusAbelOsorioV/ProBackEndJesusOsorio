import { Schema, model } from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = new Schema({
    products: {
        type: [{
            product:{
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }]
    }
})

cartsSchema.pre('find', function(){
    this.populate('products.product')
})

const cartModel = model(cartsCollection, cartsSchema);

export default cartModel;