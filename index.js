// main server controller here
var express = require('express');
var socket = require('socket.io');

// App setup, invoke express funct.
var app = express();
var server = app.listen(5000, function() {
  console.log('listening on port 5000');
});

// Middleware/ using Static public files to serve
app.use(express.static('public'));

// setup socket to work in the server
var io = socket(server);

// adding user managing modules from other class
// inspired from adrianhajdin.
const { addUser, getUser, editUser, removeUser } = require('./userMan.js');

// listen on server io connection, then fire a callback
// funct. refers to a particular instance of a socket
// to do stuff with that socket object later on.
// And log the socket.id
const prefix = 'user#';
io.on('connection', function(socket) {
  const { user } = addUser({
    id: socket.id,
    name: prefix.concat(socket.id.substring(16))
  });
  console.log('someone is socket-connected. id: '+ socket.id +', '+ user.name);

  // listens emitted chat contains data in it.
  // refers to ALL socket connections inside chat room,
  // then emit data sent by one of the client to ALL
  // the other socket clients.
  // data is a bundled variable inside {} with : of it.
  socket.on('chat', function(data){
    editUser(socket.id, data);
    io.sockets.emit('chat', data);
  });

  // listens particular emitted typing event from clientside
  // to every other clients EXCEPT the typer, of the typer
  // data which consist of their ID in clientside/frontend.
  socket.on('typing', (data) => {
    const user = getUser(socket.id);
    if (data.trim() == '') {
      socket.broadcast.emit('typing', user.name);
    } else {
      socket.broadcast.emit('typing', data);
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected.`);
  });
});
