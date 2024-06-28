
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