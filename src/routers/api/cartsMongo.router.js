import { Router } from "express";
import CartsManager from "../../dao/CartMongo.manager.js";
import cartModel from "../../models/carts.model.js";

const router = Router();

const cartS = new CartsManager();


router.get('/carts', async (req, res) =>{
    const carts = await cartS.getCart()
    res.status(200).json(carts);
});

router.get('/carts/:cid', async (req, res) =>{
    const {cid} = req.params;
    const carts = await cartS.getCartBy();
    res.status(200).json(carts);
});

router.post('/carts', async (req, res) =>{
    const {body} = req;
    const carts = await cartS.createCart(body);
    res.status(201).json(carts);
});

router.put('/carts/:cid/products/pid', async (req, res) =>{
    const {cid, pid} = req.params;
    const carts = await cartS.createCart(cid, pid);
    res.status(201).json(carts);
});

router.delete('/carts/:cid/products/pid', async (req, res) =>{
    const {cid, pid} = req.params;
    await cartS.deleteProductCart(cid, pid);
    res.status(204).end();
})
router.delete('/carts/:cid/', async (req, res) =>{
    const {cid} = req.params;
    await cartS.deleteCart(cid);
    res.status(204).end();
})


export default router;