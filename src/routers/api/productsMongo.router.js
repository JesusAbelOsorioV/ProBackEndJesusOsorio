import { Router } from "express";
import ProductsManager from "../../dao/ProductMongo.manager.js";

const router = Router();
const productS = new ProductsManager();

router.get('/products', async (req, res) => {
    const products = await productS.getProducts();
    res.status(200).json(products)
});

router.get('/products/:pid', async (req, res) =>{
    const {pid} = req.params;
    const products = await productS.getProductById(pid)
    res.status(200).json(products);
});

router.post('/products', async (req, res) =>{
    const {body} = req;
    const products = await productS.createProduct(body);
    res.status(201).json(products);
});

router.put('/products/:id', async (req, res) =>{
    const {pid} = req.params;
    const {body} = req;
    await productS.updateProductById(pid, body);
    res.status(204).end()
});

router.delete('/products/:pid', async (req, res) =>{
    const {pid} = req.params;
    await productS.delateProductById(pid);
    res.status(204).end();
});

export default router