import { productModel } from "../models/products.model.js";
import { logger } from "../utils/logger.js";

export default class ProductsManager {
    constructor(){
        this.productModel = productModel
    }
     getProducts = async({ limit = 10, numPage=1 }) =>{
        const products = await this.productModel.paginate({}, {limit, page: numPage,sort: {title: -1} , lean: true})
        return products
    }
	getAll = async() =>{
		const products = await this.productModel.find()
		return products
	}
    async getProductById(pid){
        const product = await productModel.findById(pid);
        if (!product){
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async createProduct(data){
        const product = await productModel.create(data);
        console.log(`Producto creado correctamente ${product._id}`);
        return product;
    }
    async updateProductById(pid, data){
        await productModel.updateOne({ _id: pid }, { $set: data});
        console.log(`Producto actualizado corectamente ${pid}`);
    }

    async delateProductById(pid){
        await productModel.deleteOne( { _id: pid });
        logger.info(`Producto eliminado correctamente ${pid}`);
    }
}

const productInsert = [
	{
		
		"title": "producto prueba 1",
		"description": "Este es un producto prueba1",
		"price": 500,
		"thumbnail": "sin imagen",
		"code": "asd1231",
		"stock": 12
	},
	{
		
		"title": "producto prueba 2",
		"description": "Este es un producto prueba2",
		"price": 760,
		"thumbnail": "sin imagen",
		"code": "asd1232",
		"stock": 24
	},
	{
		
		"title": "producto prueba 3",
		"description": "Este es un producto prueba3",
		"price": 430,
		"thumbnail": "sin imagen",
		"code": "asd1583",
		"stock": 12
	},
	{
		
		"title": "producto prueba 4",
		"description": "Este es un producto prueba4",
		"price": 690,
		"thumbnail": "sin imagen",
		"code": "asd8442",
		"stock": 19
	},
	{
		
		"title": "producto prueba 5",
		"description": "Este es un producto prueba 5",
		"price": 200,
		"thumbnail": "sin imagen",
		"code": "asd123",
		"stock": 13
	},
	{
		
		"title": "producto prueba 6",
		"description": "Este es un producto prueba",
		"price": 370,
		"thumbnail": "sin imagen",
		"code": "asd5351",
		"stock": 25
	},
	{
		
		"title": "producto prueba 7",
		"description": "Este es un producto prueba7",
		"price": 540,
		"thumbnail": "sin imagen",
		"code": "asd1864",
		"stock": 23
	},
	{
		
		"title": "producto prueba 8",
		"description": "Este es un producto prueba8",
		"price": 465,
		"thumbnail": "sin imagen",
		"code": "asd397",
		"stock": 63
	},{
		
		"title": "producto prueba 9",
		"description": "Este es un producto prueba9",
		"price": 500,
		"thumbnail": "sin imagen",
		"code": "asd1351",
		"stock": 8
	},
	{
		
		"title": "producto prueba 10",
		"description": "Este es un producto prueba10",
		"price": 935,
		"thumbnail": "sin imagen",
		"code": "asd6452",
		"stock": 32
	}
]