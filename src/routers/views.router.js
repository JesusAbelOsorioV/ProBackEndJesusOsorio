import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import ProductsManagerMongo from "../dao/ProductMongo.manager.js";

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

router.get('/products', async (req, res) =>{
    const {numPage, limit} = req.query
    const productsService = new ProductsManagerMongo()
    const {docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await productsService.getProducts({ limit, numPage})
    // console.log(products)
    res.render('products',{
        products: docs,
        page,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    })
})


export default router