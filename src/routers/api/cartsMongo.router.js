import { Router } from "express";
import CartsManager from "../../dao/CartMongo.manager.js";

const router = Router();

router.get('/carts', async (req, res) =>{
    const carts = await CartsManager.get();
    res.status(200).json(carts);
});

router.get('/carts/:cid', async (req, res) =>{
    const {cid} = req.params;
    const carts = await CartsManager.getById(cid);
    res.status(200).json(carts);
});

router.post('/carts', async (req, res) =>{
    const {body} = req;
    const carts = await CartsManager.create(body);
    res.status(201).json(carts);
});

export default router;