import { productModel } from "../models/products.model.js";

export default class ProductsManager {
    constructor(){
        this.productModel = productModel
    }
    async getProducts({limit = 10, numPage=1}) {
        const products = await this.productModel.paginate({}, {limit, page: numPage,sort: {title: -1} , lean: true})
        return products
    }
    async getById(pid){
        const product = await productModel.findById(pid);
        if (!product){
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async create(data){
        const product = await productModel.create(data);
        console.log(`Producto creado correctamente ${product._id}`);
        return product;
    }
    async updateById(pid, data){
        await productModel.updateOne({ _id: pid }, { $set: data});
        console.log(`Producto actualizado corectamente ${pid}`);
    }

    async delateById(pid){
        await productModel.deleteOne( { _id: pid });
        console.log(`Producto eliminado correctamente ${pid}`);
    }
}