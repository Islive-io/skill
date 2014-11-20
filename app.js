
// load config
var config = require('./config.js');

// load modules
var debug = require('debug')('chat');
var express = require('express');
var socket = require('socket.io');

// create express app
var app = express();

// use static middleware to serve files
app.use(express.static('./public'));

// redirect "home" to the example page
app.get('/', function(req, res) {
  res.redirect(301, '/example.html');
});

// create server and listen
var server = app.listen(config.app.port, config.app.host, function() {
  var address = server.address();
  debug('\'%s\' listening on %s:%s', config.app.name, address.address, address.port);
});

// server listens for socket connections
var io = socket(server);

// chat app listens on socket
var chat = require('./lib/chat')(io);

// TODO:
// - chat object is eventemitter
// - events are logged to database
// - route is added to view event log
