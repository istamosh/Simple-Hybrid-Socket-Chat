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

// listen on server io connection, then fire a callback
// funct. refers to a particular instance of a socket
// to do stuff with that socket object later on.
// And log the socket.id
io.on('connection', function(socket){
  console.log('someone is socket-connected. id: '+ socket.id);

  // listens emitted chat contains data in it.
  // refers to ALL socket connections inside chat room,
  // then emit data sent by one of the client to ALL
  // the other socket clients.
  // data is a bundled variable inside {} with : of it.
  socket.on('chat', function(data){
    io.sockets.emit('chat', data);
  });
});
