// this file is used for establish to server connection
var socket = io.connect('http://localhost:5000');

// Query DOM, index.html ids handler
var message = document.getElementById('message');
handle = document.getElementById('handle'),
btnSend = document.getElementById('send'),
output = document.getElementById('output');

// emit events.
// on send button click, callback a function.
// emitting socket consists of two params., the first is
// going to be "chat" messages, the second is the data
// or object to be send to server.
// below contains two datas: message and handle.
btnSend.addEventListener('click', function(){
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
  });
});

// listen for events on server-side.
// append pre-cooked code inside output's HTML as chat comp.
socket.on('chat', function(data){
  output.innerHTML += '<p><strong>' + data.handle +
  ': </strong>' + data.message + '</p>';
})
