
requirejs.config({
  baseUrl: 'script',
  paths: {
    jquery: 'lib/jquery-2.1.1.min',
    socketio: '../socket.io/socket.io'
  }
});

requirejs(['jquery', 'socketio', 'chat/app'], function($, io, App) {
  var socket = io.connect();
  $(function() {
    var target = $('#chat-widget');
    new App(socket).attach(target).focus();
  });
});
