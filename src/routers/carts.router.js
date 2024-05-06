import { Router } from "express";
import CartsManager from "../dao/CartManager.js"
import { json } from "express";
const router = Router();

const cartJson = '../Cart.json'
const cartManager = new CartsManager(cartJson);

router.use(json());

router.get("/carts", async(req, res) =>{
    const cart = await cartManager.getJsonCart();
    res.json(cart);
});

router.get("/carts/:cid", async (req, res)=>{
    const cid = req.query;
    const cart = await cartManager.getCartById(cid);
    if(cart){
        res.json(cart);
    }else{
        res.json({ error: 'Cart no encontrado'})
    }
});

router.post("/carts", async (req, res) =>{
    const newCart = await cartManager.addCart();
    res.json(newCart);
})

router.post("/carts/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if(typeof quantity !== 'number' || quantity < 1){
        res.json({ error: 'quantity debe ser un numero positivo'});
    } const cart = await cartManager.addProductCart(cartId, productId, quantity);
    res.json(cart)
})
export default router;