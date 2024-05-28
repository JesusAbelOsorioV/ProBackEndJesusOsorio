import { Router } from "express";
import router from "../views.router.js";
import UserManagerMongo from "../../dao/userMongo.manager.js";
import auth  from "../../middlewares/auth.middleware.js"

const sessionsRouter = Router()

const userService = new UserManagerMongo();

sessionsRouter.post('/register', async (req, res) =>{
    try {
    const {first_name, last_name, email, password} = req.body

    if(!email || !password) return res.status(401).send({status: 'error', erorr: 'todos los campos son requeridos'})

    const userExist = await userService.getUserBy({email})
    if(userExist) return res.status(401).send({status: 'error', erorr: 'el usuario ya existe'})
    
    const newUser ={
        first_name,
        last_name,
        email,
        password
    }

    const result = await userService.createUser(newUser)
    console.log(result);
    res.send('usuario registrado')     
    } catch (error) {
       console.log(error)
    }
    
})

sessionsRouter.post('/login', async (req, res)=>{
    const {email, password} = req.body
    if(!email || !password) return res.status(401).send({status: 'error', erorr: 'todos los campos son requeridos'})
    
    const userFound = await userService.getUserBy({email})
    if(!userFound) return res.status(401).send({status: 'error', erorr: 'usuario o password incorrectos'}) 
    
    req.session.user ={
        first_name: userFound.first_name,
        email,
        admin: userFound.role === 'admin'
    }
        
    res.redirect('/products', userFound.first_name, userFound.role)
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