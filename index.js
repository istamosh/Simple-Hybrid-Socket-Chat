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
const { addUser, getUser, updateUser, displayAllUsers, removeUser } = require('./userMan.js');


function someoneConnected(id) {
  const prefix = 'user#';
  const { user } = addUser({
    id: id,
    name: prefix.concat(id.substring(16))
  });
  console.log('someone is socket-connected. id: '+ id +', '+ user.name);
  displayAllUsers();
}
// listen on server io connection, then fire a callback
// funct. refers to a particular instance of a socket
// to do stuff with that socket object later on.
// And log the socket.id
io.on('connection', function(socket) {
  someoneConnected(socket.id);
  io.to(socket.id).emit('defaultName', {
    userName: getUser(socket.id).name
  });
  // listens emitted chat contains data in it.
  // refers to ALL socket connections inside chat room,
  // then emit data sent by one of the client to ALL
  // the other socket clients.
  // data is a bundled variable inside {} with : of it.
  socket.on('chat', function(data) {
    let updated = updateUser(socket.id, data);
    //console.log(`updated status: ${updated}`);
    if (updated) {
      displayAllUsers();
    }

    if (data.userName.trim() == '') {
      let user = getUser(socket.id);
      data.userName = user.name;
      console.log(`if trim test "${data.userName}", let: ${user.name}`); //debug
      io.sockets.emit('chat', data);
    } else {
      io.sockets.emit('chat', data);
    }
  });

  // listens particular emitted typing event from clientside
  // to every other clients EXCEPT the typer, of the typer
  // data which consist of their ID in clientside/frontend.
  socket.on('typing', (data) => {
    let user = getUser(socket.id);
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
