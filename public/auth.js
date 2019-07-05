window.onload = () => {

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        location.replace('/chat');
    } else {
        location.replace('/login');
    }

}
