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

const app = express();

const { port } = objectConfig

const httpServer = app.listen(port, () =>{
    console.log(`Servidor corriendo en el puerto ${port}`);
});

const socketServer = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(cookieParser())

initPassport()
app.use(passport.initialize())

app.use(routerApp)
app.use(handleErrors)
app.engine('hbs', handlebars.engine({ extname: '.hbs'}));
app.set('views', __dirname+'/views')
app.set('view engine', 'hbs')

connectDB();

let messages = [];

socketServer.on('connection', socket => {
    console.log('Cliente Conectado');

    socket.on('message', async (data) => {
        console.log('message data: ', data)
        // guardamos los mensajes
        await ChatManager.create(data.user, data.message)
        messages = await ChatManager.getChat();

        // emitimos los mensajes
        socketServer.emit('messageLogs', messages)
    })
});
