window.onload = () => {

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        location.replace('/login');
    } else {
        const socket = io.connect('http://localhost:3000');
    
        const submitBtn = document.querySelector('#submit-btn');
        const textField = document.querySelector('#message-text');
        const messageListElem = document.querySelector('#message-list');
    
        submitBtn.addEventListener('click', ev => {
            socket.emit('submitMessage', { message: textField.value, token: jwt });
        });
    
        socket.on('newMessage', payload => {
            const newLi = document.createElement('li');
            newLi.innerHTML = `${payload.message} - ${payload.user}`;
            messageListElem.appendChild(newLi);
        });

    }

}
