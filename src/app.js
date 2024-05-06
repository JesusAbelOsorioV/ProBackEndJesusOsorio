import express from 'express'
// import produtsRouter from './routers/products.router.js'
// import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import connectDB from './config/index.js'
import produtsRouter from './routers/api/productsMongo.router.js'
import cartsRouter from './routers/api/cartsMongo.router.js'
import chatRouter from './routers//api/chatMongo.router.js'
import { chatModel } from './models/chat.model.js'

const app = express();
const httpServer = app.listen(8080, () =>{
    console.log('Servidor corriendo en el puerto 8080');
});

const socketServer = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname+'/public'));

app.engine('hbs', handlebars.engine({ extname: '.hbs'}));
app.set('views', __dirname+'/views')
app.set('view engine', 'hbs')

connectDB();

app.use('/', viewsRouter);
app.use('/api', produtsRouter);
app.use('/api', cartsRouter);
app.use('/api', chatRouter);

let messages = new chatModel;

socketServer.on('connection', socket => {
    console.log('Cliente Conectado');

    socket.on('message', data => {
        console.log('message data: ', data)
        // guardamos los mensajes
        messages.push(data);
        // emitimos los mensajes
        socketServer.emit('messageLogs', messages)
    })
});
export const newMessageFromDB = data => {
    messages.push(data);
    socketServer.emit('messageLogs', messages);
}