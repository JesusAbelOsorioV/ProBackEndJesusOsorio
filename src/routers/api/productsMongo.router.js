import { Router } from "express";
import ProductsManager from "../../dao/ProductMongo.manager.js";

const router = Router();

router.get('/products', async (req, res) => {
    const products = await ProductsManager.getProducts();
    res.status(200).json(products)
});

router.get('/products/:pid', async (req, res) =>{
    const {pid} = req.params;
    const products = await ProductsManager.getById(pid);
    res.status(200).json(products);
});

router.post('/products', async (req, res) =>{
    const {body} = req;
    const products = await ProductsManager.create(body);
    res.status(201).json(products);
});

router.put('/products/:id', async (req, res) =>{
    const {pid} = req.params;
    const {body} = req;
    await ProductsManager.updateById(pid, body);
    res.status(204).end()
});

router.delete('/products/:pid', async (req, res) =>{
    const {pid} = req.params
    await ProductsManager.delateById(pid);
    res.status(204).end();
});

export default router