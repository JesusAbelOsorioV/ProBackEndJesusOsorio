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
import { sendRecoveryPass } from "../../utils/sendEmail.js";
import { logger } from "../../utils/logger.js";

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

sessionsRouter.post('/send-email-resetPassword', async (req, res) => {
    const email = req.body;

    try {
        const user = await userService.getUserBy({email: email.email});

        if (!user) return res.status(400).send({ status: 'error', error: `El usuario con el mail ${email.email} no existe` });

        const token = generateToken({ id: user._id }, '1h');

        sendRecoveryPass({
            email: user.email,
            subject: 'Reestablecer contraseña',
            html: `
                <h1>Hola! ${user.first_name} ${user.last_name}</h1>
                <h2>Haz click en el link para reestablecer la contraseña</h2>
                <a href="http://localhost:8080/reset-password?token=${token}">Reestablecer contraseña</a>
            `

        });
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        }).send({ status: 'success', error: 'Se envio un email a su casilla' });
    } catch (error) {
        logger.error(error);
        return res.status(500).send({ status: 'error', error: error.message });
    }
});
sessionsRouter.post('/reset-password', passportCall('jwt'), async (req, res) => {
    const { newPassword, newPasswordRetype } = req.body;
    const token = req.headers.authorization;
    const user = req.user;
   
    if (!newPassword) return res.status(400).send({ status: 'error', error: 'Escriba la nueva contraseña' });
    if (newPassword !== newPasswordRetype) return res.status(400).send({ status: 'error', error: 'Las contraseñas deben coincidir' });

    const userFound = await userService.getUserBy({ _id: user.id });

    if (!token) return res.status(400).send({ status: 'error', error: 'Tiempo agotado, vuelve a intentarlo desde la pagina para restablecer la contraseña' })
    if (!userFound) return res.status(400).send({ status: 'error', error: 'Usuario no existe' });
    if (isValidPassword(newPassword, userFound)) return res.status(400).send({ status: 'error', error: 'Debe ingresar una contraseña diferente a la anterior' });
    
    try {
        await userService.updateUser({ _id: user.id }, {
            password: createHash(newPassword)
        });
        res.status(200).send({ status: 'success', error: 'Contraseña actualizada' });
    } catch (error) {
        logger.error('Error al actualizar la contraseña:', error);
        res.status(500).send({ status: 'error', error: 'Error' });
    }
});

sessionsRouter.get('/current', passportCall('jwt') , authorization('admin'), (req, res) =>{
    res.send('datos sensibles que solo puede ver el admin')
})

// sessionsRouter.get('/mail', async (req, res) =>{
//     try {
//         sendEmail()
//         res.send ('email enviado')
//     } catch (error) {
//         logger.error(error);
//     }
// })

export default sessionsRouter