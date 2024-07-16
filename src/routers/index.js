import { Router } from "express";
import viewsRouter from './views.router.js'
import produtsRouter from './api/productsMongo.router.js'
import cartsRouter from './api/cartsMongo.router.js'
import chatRouter from './api/chatMongo.router.js'
import sessionsRouter from './api/sessions.router.js'
import userRouter from './api/user.router.js'
import ticketRouter from './api/ticket.router.js'
import mockingRouter from './api/mockingProducts.js'
const router = Router()

router.use('/', viewsRouter);
router.use('/api', produtsRouter);
router.use('/api', cartsRouter);
router.use('/api', chatRouter);
router.use('/api/sessions', sessionsRouter);
router.use('/api', userRouter);
router.use('/api', ticketRouter)
router.use('/api', mockingRouter)
router.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('Error 500 en el server');
    return next();
});

export default router