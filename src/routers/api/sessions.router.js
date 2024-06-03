import { Router } from "express";
import router from "../views.router.js";
import UserManagerMongo from "../../dao/userMongo.manager.js";
import auth  from "../../middlewares/auth.middleware.js"
import passport from "passport";

const sessionsRouter = Router()

const userService = new UserManagerMongo();

sessionsRouter.get('/github', passport.authenticate('github', {scope: 'user:email'}), async(req, res) =>{})
sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), (req, res) =>{
    req.session.user = req.user
    res.redirect('/products')
})
// sessionsRouter.post('/register', async (req, res) =>{
//     try {
//     const {first_name, last_name, email, password} = req.body

//     if(!email || !password) return res.status(401).send({status: 'error', erorr: 'todos los campos son requeridos'})

//     const userExist = await userService.getUserBy({email})
//     if(userExist) return res.status(401).send({status: 'error', erorr: 'el usuario ya existe'})
    
//     const newUser ={
//         first_name,
//         last_name,
//         email,
//         password: createHash(password)
//     }

//     const result = await userService.createUser(newUser)
//     console.log(result);
//     res.send('usuario registrado')     
//     } catch (error) {
//        console.log(error)
//     }
    
// })

// sessionsRouter.post('/login', async (req, res)=>{
//     const {email, password} = req.body
//     if(!email || !password) return res.status(401).send({status: 'error', erorr: 'todos los campos son requeridos'})
    
//     const userFound = await userService.getUserBy({email})
//     if(!userFound) return res.status(401).send({status: 'error', erorr: 'usuario o password incorrectos'}) 

//     const isValid = isValidPassword(password, {password: userFound.password})

//     if(!isValidPassword(password, {password: userFound.password})) return res.status(401).send({status: 'error', error: 'Password incorrecta'})
    
//     req.session.user ={
//         first_name: userFound.first_name,
//         email,
//         admin: userFound.role === 'admin'
//     }
        
//     res.redirect('/products', userFound.first_name, userFound.role)
// })

sessionsRouter.post('/register', passport.authenticate('register', {failureRedirect: '/failregister'}), async (req, res) =>{
    res.send({status: 'success', message: 'Usuario Registrado'})
    // res.redirect('/products')
})
sessionsRouter.post('/failregister', async (req, res) =>{
    console.log('fallo el registro del usuario')
    res.send({error: 'failed'})
})

sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}) ,async(req, res) =>{
    const userFound = await userService.getUserBy(req.email)
    if(!req.user) return res.status(400).send({status: 'error', error: 'credenciales invalidas'})
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name_name,
        email: req.user.email,
        admin: userFound.role === 'admin'
    }
    // res.send({status: 'success'})
    res.redirect('/products', req.session.user, userFound.role)
})
sessionsRouter.post('/faillogin', (req, res) =>{
    res.send({error: 'Fallo en el login'})
})

sessionsRouter.get('/loguot', (req, res) =>{
    req.session.destroy( err =>{
        if(err) return res.send({ status: 'error', error: err})
        else return res.render('login')
    })
})

router.get('/current', auth, (req, res) =>{
    res.send('datos sensibles que solo puede ver el admin')
})

export default sessionsRouter