// this file is used for establish to server connection
var socket = io.connect('http://localhost:5000');

// Query DOM, index.html ids userNamer
var message = document.getElementById('message');
userName = document.getElementById('userName'),
btnSend = document.getElementById('send'),
output = document.getElementById('output'),
isTyping = document.getElementById('isTyping');

// emit events.
// on send button click, callback a function.
// emitting socket consists of two params., the first is
// going to be "chat" messages, the second is the data
// or object to be send to server.
// below contains two datas: message and userName.
btnSend.addEventListener('click', function(){
  socket.emit('chat', {
    message: message.value,
    userName: userName.value
  });
});

// keypress event listener of message, custom arrow func.
// then emit typing event if someone is typing.
message.addEventListener('keypress', () => {
  socket.emit('typing', userName.value);
});

// listen for events on server-side.
// append pre-cooked code inside output's HTML as chat comp.
// reset isTyping HTML to empty (this need more work).
socket.on('chat', function(data){
  isTyping.innerHTML = "";
  output.innerHTML += '<p><strong>' + data.userName +
  ': </strong>' + data.message + '</p>';
});

// listening on typing event with carried data from
// serverside, then append into isTyping's HTML side.
// concatenate data variable between two HTML tags.
// note: <em> tag is italic style, named 'emphasis'
socket.on('typing', (data) => {
  isTyping.innerHTML = '<p><em>' + data + 'is typing... </em></p>';
});
