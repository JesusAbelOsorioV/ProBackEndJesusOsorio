import cartModel from '../models/carts.model.js';

export default class CartsManager{
    static get(){
        return cartModel.find();
    }
    static async getById(cid){
        const cart = await cartModel.findById(cid);
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }
        return cart;
    }
    static async create(data){
        const cart = await cartModel.create(data);
        console.log(`Carrito creado con exito (${cart._id})`);
        return cart;
    }
}