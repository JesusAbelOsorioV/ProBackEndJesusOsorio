import { Router } from "express";
import router from "../views.router.js";
import UserManagerMongo from "../../dao/userMongo.manager.js";
import auth  from "../../middlewares/auth.middleware.js"
import passport from "passport";
import CartsManager from "../../dao/CartMongo.manager.js";
import { createHash, isValidPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.js";
import  passportCall  from "../../middlewares/passportCall.middlewares.js";
import authorization  from "../../middlewares/authorization.middleware.js";

const sessionsRouter = Router()

const userService = new UserManagerMongo();
const cartServise = new CartsManager();

sessionsRouter.get('/github', passport.authenticate('github', {scope: 'user:email'}), async(req, res) =>{})
sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), (req, res) =>{
    req.session.user = req.user
    res.redirect('/products')
})

sessionsRouter.post('/register', async (req, res) =>{
    const {first_name, last_name, password, email} = req.body
    if(!password || !email) return res.status(401).send ({status:'error', message: 'Campos requeridos'})
    const userFound = await userService.getUserBy({email})
    if(userFound) return res.status(401).send({ status: 'error', error: `El usuario con el email ${userFound.email} ya esta registrado` })
    
    const newCart = await cartServise.createCart()
    const newUser = {
        first_name,
            last_name,
            email,
            password: createHash(password),
            cartID: newCart._id
    }
    const result = await userService.createUser(newUser)
    const token = generateToken({
        email,
        id: result._id,
        first_name,
        last_name,
        cartID: result.cartID,
        role: userFound.role
    })
    res.cookie('token', token,{
        maxAge: 60*60*100*24,
        httpOnly: true
    }).send({status: 'success', message: 'Usuario Registrado'})
})

sessionsRouter.post('/login',async(req, res) =>{
    const {password, email} = req.body
    if(!password || !email) return res.status(401).send ({status:'error', message: 'Campos requeridos'})
    const userFound = await userService.getUserBy({email})
    if (!userFound) return res.status(400).render('login', ({ status: 'error', error: 'Usuario no encontrado' }));
    if(!isValidPassword(password, { password: userFound.password })) return res.status(400).send({status: 'error', error: 'credenciales invalidas'})
    
    const token = generateToken({
        email,
        id: userFound._id,
        cartID: userFound.cartID,
        role: userFound.role
    })
    res.cookie('token', token,{
        maxAge: 60*60*100*24,
        httpOnly: true
    }).send({status: 'success', message: 'Usuario logueado'})
    
})

sessionsRouter.get('/loguot', (req, res) =>{
    res.clearCookie('token')
    return res.redirect('/login')
})

sessionsRouter.get('/current', passportCall('jwt') , authorization('admin'), (req, res) =>{
    res.send('datos sensibles que solo puede ver el admin')
})

export default sessionsRouter