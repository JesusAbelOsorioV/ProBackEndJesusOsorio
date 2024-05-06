import fs from 'fs'
import ProductManager from './ProductManager.js';

const products = new ProductManager;

class CartsManager{
    constructor(){
        this.path = './Carts.json'
        this.carts = this.carts;
    }

    async addCart(){
        const carts = await this.getJsonCart(this.path)
        const newCart ={
            id: this.carts.length + 1,
            products: []
        }
        carts.push(newCart);
        return this.saveJsonCart(this.path, carts)

    }

    async getCartById(cartId){
        const carts = await this.getJsonCart();
        const cart = carts.find((car) => car.id === cartId);
        return cart;
    }

    async addProductCart(cartId, productId, quantity = 1){
        const carts = await this.getJsonCart();
        const cart = carts.findIndex(cart => cart.id === cartId);
        if(cart === -1){
            throw new Error('Carrito no encotrado')
        }
        const ProductE = carts[cart].products.findIndex(i => i.product === productId);
        if(ProductE !== -1){
            carts[cart].products[ProductE].quantity += quantity;
        }else{
            carts[cart].products.push({ product: productId, quantity });
            return this.saveJsonCart(this.path, carts);
        }
    }

    getJsonCart = async (path) =>{
        if(!fs.existsSync(path)){
            return [];
        }
        const content = await fs.promises.readFile(path, 'utf-8');
        return JSON.parse(content)
    };

    saveJsonCart = async (path, data) =>{
        const content = JSON.stringify(data, null, '\t');
        try{
            await fs.promises.writeFile(path, content, 'utf-8');
        } catch (error){
            throw new Error(`El archivo ${path} no se modifico`);
        }
    };
}

export default CartsManager;