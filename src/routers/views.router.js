import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import ProductsManagerMongo from "../dao/ProductMongo.manager.js";
import CartsManagerMongo from "../dao/CartMongo.manager.js"
import passportCall from "../middlewares/passportCall.middlewares.js";
import authorization from "../middlewares/authorization.middleware.js";
import { ticketService } from "../service/service.js";
import generateMockProducts from "../utils/generateMockProducts.js";
import jwt from 'jsonwebtoken'
import { logger } from "../utils/logger.js";

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

router.get('/products', passportCall('jwt'), authorization('admin', 'user'),async (req, res) =>{
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

router.get('/product/:pid', passportCall('jwt'), authorization('admin', 'user'), async (req, res) =>{
    const {pid} = req.params;
    const product = await productsService.getProductById(pid);
    const cartId = ''
    res.render('./products.hbs', {product, cartId})
})

router.get('/cart/:cid', passportCall('jwt'), authorization('admin', 'user'), async (req, res) =>{
    const {cid} = req.params;
    const cart = await cartService.getCartBy(cid);
    res.render('./cart.hbs', {cart})
})

router.get('/chat', passportCall('jwt'), authorization('admin', 'user'), async (req, res) =>{
    res.render('.chat.hbs',{})
})

router.get('/user', async (req, res) =>{
    res.render('user')
})
router.get('/ticket/:tid', async (req, res) =>{
    const { tid } = req.params
    const ticket = await ticketService.getTicketBy({ _id: tid})
    res.render('ticket', {ticket})
})

router.get('/login', (req, res) =>{
    res.render('login')
})
router.get('/register', (req, res) =>{
    res.render('register')
})

router.get('/logout', (req, res) =>{
    res.clearCookie('token')
    return res.redirect('/login')
})

router.get('/loggerTest', (req, res) =>{
    req.logger.warning('Alerta')
    res.send('logs')
})

router.get('/recovery-password', async (req, res) =>{
    res.render('recoveryPassword')
})

router.get('/reset-password', async (req, res) =>{
    const token = req.query.token

    if(!token){
        return res.render('recoveryPassword')
    }

    try {
        const tokenVerif = jwt.verify(token, JWT_PRIVATE_KEY)
        logger.info('token:', tokenVerif)
        res.render('resetPassword')
    } catch (error) {
        logger.error('token expirado:', error)
        res.render('recoveryPassword')
    }
})

router.get('/create-Products', passportCall('jwt'), authorization('premium', 'admin'), async (req, res) =>{
    res.render('./createProducts')
})


export default router