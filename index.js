// main server controller here
var express = require('express'),
  socket = require('socket.io');

// App setup, invoke express funct.
var app = express();

// want to use this as login page
//app.get('/', (req, res) => {
//  res.send('Login page.');
//});
// then this to chat page, how to do that?
app.use(express.static('public'));

var server = app.listen(5000);
// setup socket to work in the server
var io = socket(server);

// adding user managing modules from other class
// inspired from adrianhajdin.
const { addUser, getUser, updateUser, displayAllUsers, removeUser } = require('./userMan.js');

// listen on server io connection, then fire a callback
// funct. refers to a particular instance of a socket
// to do stuff with that socket object later on.
// And log the socket.id
io.on('connection', function(socket) {
  addUser({
    id: socket.id,
    name: ('user#').concat(socket.id.substring(16))
  });
  //console.log(`(${socket.id}) is connected.`);
  socket.broadcast.emit('systemChat', {
    name: 'system',
    message: `${('user#').concat(socket.id.substring(16))} came in.`
  });
  //console.log(`cookies: ${socket.request.headers.cookie}`);
  /*
  io.to(socket.id).emit('defaultName', {
    userName: getUser(socket.id).name
  });
  */
  // listens emitted chat contains data in it.
  // refers to ALL socket connections inside chat room,
  // then emit data sent by one of the client to ALL
  // the other socket clients.
  // data is a bundled variable inside {} with : of it.
  socket.on('chat', function(data) {
    let updated = updateUser(socket.id, data);

    if (data.userName.trim() == '') {
      let user = getUser(socket.id);
      data.userName = user.name;
    }
    io.sockets.emit('chat', data);
  });

  // listens particular emitted typing event from clientside
  // to every other clients EXCEPT the typer, of the typer
  // data which consist of their ID in clientside/frontend.
  socket.on('typing', (data) => {
    if (data.trim() == '') {
      let user = getUser(socket.id);
      data = user.name;
    }
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', () => {
    let user = removeUser(socket.id);
    if (user) {
      //console.log(`${socket.id} has disconnected.`);
      //displayAllUsers();

      io.sockets.emit('systemChat', {
        name: 'system',
        message: `${user.name}(${user.id}) left the chat.`
      });
    }
  });
});
