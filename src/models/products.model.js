import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productsSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number
});

productsSchema.plugin(mongoosePaginate)

export const productModel = model(productCollection, productsSchema)
