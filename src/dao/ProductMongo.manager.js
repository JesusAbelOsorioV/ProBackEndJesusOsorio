import { productModel } from "../models/products.model.js";

export default class ProductsManager {
    static get() {
        return productModel.find();
    }
    static async getById(pid){
        const product = await productModel.findById(pid);
        if (!product){
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    static async create(data){
        const product = await productModel.create(data);
        console.log(`Producto creado correctamente ${product._id}`);
        return product;
    }
    static async updateById(pid, data){
        await productModel.updateOne({ _id: pid }, { $set: data});
        console.log(`Producto actualizado corectamente ${pid}`);
    }

    static async delateById(pid){
        await productModel.deleteOne( { _id: pid });
        console.log(`Producto eliminado correctamente ${pid}`);
    }
}