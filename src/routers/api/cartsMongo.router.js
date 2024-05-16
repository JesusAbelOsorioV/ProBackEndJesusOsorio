import { Router } from "express";
import CartsManager from "../../dao/CartMongo.manager.js";

const router = Router();

router.get('/carts', async (req, res) =>{
    const carts = await CartsManager.getCart()
    res.status(200).json(carts);
});

router.get('/carts/:cid', async (req, res) =>{
    const {cid} = req.params;
    const carts = await CartsManager.getCartBy(cid);
    res.status(200).json(carts);
});

router.post('/carts', async (req, res) =>{
    const {body} = req;
    const carts = await CartsManager.create(body);
    res.status(201).json(carts);
});

router.put('/carts/:cid/products/pid', async (req, res) =>{
    const {cid, pid} = req.params;
    const carts = await CartsManager.create(cid, pid);
    res.status(201).json(carts);
});

router.delete('/carts/:cid/products/pid', async (req, res) =>{
    const {cid, pid} = req.params;
    await CartsManager.deleteProductCart(cid, pid);
    res.status(204).end();
})
router.delete('/carts/:cid/', async (req, res) =>{
    const {cid} = req.params;
    await CartsManager.deleteCart(cid);
    res.status(204).end();
})


export default router;