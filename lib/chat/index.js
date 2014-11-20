
var Client = require('./client');
var Buffer = require('./buffer');
var Registry = require('./registry');

// chat application
var App = function(io) {

  var app = this;

  var buffer = new Buffer();
  var registry = new Registry();

  this.getBuffer = function() {
    return buffer.read();
  };

  this.getUsers = function() {
    return registry.read();
  };

  this.notify = function(text) {
    io.emit('chat-notification', {
      text: text
    });
  };

  this.broadcast = function(text, client) {
    var user = client.user();
    buffer.add(text, user);
    io.emit('chat-broadcast', {
      text: text,
      user: user
    });
  };

  this.connect = function(client) {
    registry.add(client);
    io.emit('chat-user-connected', {
      user: client.user()
    });
  };

  this.disconnect = function(client) {
    registry.remove(client);
    io.emit('chat-user-disconnected', {
      user: client.user()
    });
  };

  this.rename = function(client) {
    io.emit('chat-user-renamed', {
      user: client.user()
    });
  };

  this.init = function() {

    // on incoming connection, create client
    io.on('connection', function(socket) {
      new Client(app, socket).init();
    });
  };
};

// return factory
module.exports = function(io) {
  var app = new App(io);
  app.init();
  return app;
};
