import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import ProductsManagerMongo from "../dao/ProductMongo.manager.js";
import CartsManagerMongo from "../dao/CartMongo.manager.js"

const productsService = new ProductsManagerMongo();
const cartService = new CartsManagerMongo();

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

router.get('/product/:pid', async (req, res) =>{
    const {pid} = req.params;
    const product = await productsService.getProductById(pid);
    const cartId = ''
    res.render('./products.hbs', {product, cartId})
})

router.get('/cart/:cid', async (req, res) =>{
    const {cid} = req.params;
    const cart = await cartService.getCartBy(cid);
    res.render('./cart.hbs', {cart})
})

router.get('/chat', async (req, res) =>{
    res.render('.chat.hbs',{})
})

router.get('login', (req, res) =>{
    res.render('login')
})
router.get('/register', (req, res) =>{
    res.render('register')
})

router. get('/session', (req, res) =>{
    if(req.session.counter){
        req.session.counter++
        res.send()
    }
})

router.get('/logout', (req, res) =>{
    req.session.destroy( err =>{
        if(err) return res.send({ status: 'error', error: err})
        else return res.send('logout')
    })
})


export default router