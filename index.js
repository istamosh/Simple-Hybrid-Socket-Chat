// main server controller here
var express = require('express');

// App setup, invoke express funct.
var app = express();
var server = app.listen(5000, function() {
  console.log('listening on port 5000');
});

// Middleware/ using Static public files to serve
app.use(express.static('public'));
