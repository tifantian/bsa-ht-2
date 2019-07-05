const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bodyParser = require('body-parser');
const users = require('./users.json');

require('./passport.config');

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/chat', /*passport.authenticate('jwt'),*/ function (req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', function (req, res) {
  const userFromReq = req.body;
  const userInDB = users.find(user => user.login === userFromReq.login);
  if (userInDB && userInDB.password === userFromReq.password) {
    const token = jwt.sign(userFromReq, 'someSecret', { expiresIn: '24h' });
    res.status(200).json({ auth: true, token });
  } else {
    res.status(401).json({ auth: false });
  }
});

io.on('connection', socket => {
  socket.on('submitMessage', payload => {
    const { message, token } = payload;
    const userLogin = jwt.decode(token).login;
    socket.broadcast.emit('newMessage', { message, user: userLogin });
    socket.emit('newMessage', { message, user: userLogin });
  });
});