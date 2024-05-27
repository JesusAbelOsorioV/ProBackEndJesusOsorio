import cartModel from '../models/carts.model.js';

 class CartsManager{
    constructor(){
        this.cartModel = cartModel;
    }
    async getCart(){
        return await cartModel.find();
    }
    async getCartBy(cid){
        const cart = await cartModel.findOne(cid);
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }
        return cart;
    }
    async createCart(){
        const cart = await cartModel.create({products: []});
        console.log(`Carrito creado con exito (${cart._id})`);
        return cart;
    }
    async updateCart(cid, pid){
        const result = await cartModel.findByIdAndUpdate(
            {__id: cid, 'products.product': pid},
            {$inc: {'products.$.quantity':1}},
            {new: true}
        )
        if (result) return result
        const newProdCart = await cartModel.findOneAndUpdate(
            {_id: cid},
            {$push:{products: {product: pid, quantity:1}}},
            {new: true}
        )
        return newProdCart;
    }

    deleteProductCart = async (cid, pid) =>await cartModel.findOneAndDelete(
        {_id: cid},
        { $pull: { products: {product: pid}}},
        {new: true}
    )

    deleteCart = async (cid) => cartModel.findOneAndUpdate(
        {_id: cid},
        { $set: {products:[]}},
        {new: true}
    )
}

export default CartsManager;