import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router()

router.get('/', (req, res) =>{
    res.render('index', {
        title: 'Ecommers Jesús'
    })
});



router.get('/realTimeProducts', async (req, res) =>{
    const productManager = new ProductManager('../Products.json')
    res.render('realTimeProducts', {
        products: productManager.getProducts(),
    })
})

export default router