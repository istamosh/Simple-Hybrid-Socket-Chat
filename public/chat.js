// this file is used for establish to server connection
var socket = io.connect('http://localhost:5000');

// Query DOM, index.html ids userNamer
var message = document.getElementById('message'),
  userName = document.getElementById('userName'),
  btnSend = document.getElementById('send'),
  output = document.getElementById('output'),
  isTyping = document.getElementById('isTyping'),
  chatBox = document.getElementById('chat-box');

// retrieve initial name from server
/*
socket.on('defaultName', (data) => {
  userName.value = data.userName;
});
*/
// emit events.
// emitting socket consists of two params., the first is
// going to be "chat" messages, the second is the data
// or object to be send to server.
// below contains two datas: message and userName.
// you could also adding enter key to send a message
message.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault(); // idk about this

    trySendMessage();
  }
});
// on send button click, callback a function.
btnSend.addEventListener('click', function() {
  trySendMessage();
});
// adding func. for handle whitespace, click and enter event.
function trySendMessage() {
  if (message.value.trim() != '') {
    socket.emit('chat', {
      message: message.value,
      userName: userName.value
    });
    return message.value = '';
  }
}

// keypress event listener of message, custom arrow func.
// then emit typing event if someone is typing.
message.addEventListener('keypress', () => {
  socket.emit('typing', userName.value);
});

var scrollSnap = true;
chatBox.addEventListener('scroll', () => {
  var currentPos = chatBox.scrollTop + chatBox.offsetHeight;
  if (currentPos == chatBox.scrollHeight) {
    scrollSnap = true;
  }
  else {
    scrollSnap = false;
  }
});

// listen for events on server-side.
// append pre-cooked code inside output's HTML as chat comp.
// reset isTyping HTML to empty (this need more work).
socket.on('chat', function(data) {
  isTyping.innerHTML = "";
  output.innerHTML += '<p><strong>' + data.userName +
  ': </strong>' + data.message + '</p>';

  if (scrollSnap) {
    chatBox.scrollTo(0, chatBox.scrollHeight);
  }
});

// listening on typing event with carried data from
// serverside, then append into isTyping's HTML side.
// concatenate data variable between two HTML tags.
// note: <em> tag is italic style, named 'emphasis'
var typingUsers = [];
const time = 3;
socket.on('typing', (data) => {
  var typingUser = {
    name: data,
    time: time
  };
  typingUsers.push(typingUser);
  console.log(`currently typing: ${typingUsers[0].name}, time: ${typingUsers[0].time}`);

  isTyping.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
});
