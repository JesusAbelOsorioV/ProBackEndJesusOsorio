const socket = io()

const input = document.getElementById('message')
const messageList = document.getElementById('list-message')

input.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        socket.emit('mensaje_cliente', input.value)
        input.value= ''
    }
});

socket.on('message_server', data =>{
    console.log(data)
})