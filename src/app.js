import express from 'express'
import routerApp from './routers/index.js'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import connectDB from './config/index.js'
import { URI } from './config/index.js'
import ChatManager from './dao/chatMongo.manager.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { initPassport } from './config/passport.config.js'
import { objectConfig } from './config/index.js'
import { handleErrors } from './middlewares/errors.middleware.js'
import { logger } from './utils/logger.js'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import { loggerMidw } from './middlewares/logger.middleware.js'
import { swaggerOptions } from './config/swagger.config.js'
import { inactUserProcess } from './utils/inactiveUchilPros.js'
const app = express();

const { port } = objectConfig

const httpServer = app.listen(port, () =>{
    logger.info(`Servidor corriendo en el puerto ${port}`);
});

const socketServer = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(cookieParser())
app.use(loggerMidw)
initPassport()
app.use(passport.initialize())

const specs = swaggerJsDoc(swaggerOptions)
app.use('/apidocs/', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use(routerApp)
app.use(handleErrors)
app.engine('hbs', handlebars.engine({ extname: '.hbs'}));
app.set('views', __dirname+'/views')
app.set('view engine', 'hbs')

inactUserProcess()

connectDB();

let messages = [];

socketServer.on('connection', socket => {
    logger.info('Cliente Conectado');

    socket.on('message', async (data) => {
        logger.info('message data: ', data)
        // guardamos los mensajes
        await ChatManager.create(data.user, data.message)
        messages = await ChatManager.getChat();

        // emitimos los mensajes
        socketServer.emit('messageLogs', messages)
    })
});
