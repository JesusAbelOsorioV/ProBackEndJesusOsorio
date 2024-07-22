import { logger } from "./logger";

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