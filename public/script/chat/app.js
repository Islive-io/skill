
define([
  'jquery',
  'chat/templatizer',
  'chat/user',
  'chat/users',
  'chat/messages',
  'chat/input'
], function($, tpl, User, Users, Messages, Input) {

  var App = function(socket) {

    var app = this;

    // id assigned to this client
    var id = undefined;

    // create widget frame
    var $root = $(tpl.frame());

    // create managers
    // TODO: managers create their own root elements
    var input = new Input($('.chat-input', $root));
    var users = new Users($('.chat-userlist', $root));
    var messages = new Messages($('.chat-messages', $root));

    // listen for manager events

    $(input)
      .on('input', function(e, text) {

        // on input event, "parse" text (TODO: use a parser generator or such)
        var parts = text.match(/^\/(\w+)($|\s(.*)$)/); // [_, command, _, remainder]

        if(parts) {
          var command = parts[1];
          var args = parts[3];
        } else {
          var command = 'broadcast';
          var args = text;
        }

        // attempt to handle command
        switch(command) {

          case 'help':
            messages.notify('.');
            messages.notify('/emote {text} -- broadcast a notification about yourself');
            messages.notify('/to {user} {text} -- send a private message');
            messages.notify('/broadcast {text} -- broadcast a message');
            messages.notify('/unname -- become anonymous');
            messages.notify('/name {name} -- set username');
            messages.notify('.');
            messages.notify('The following commands are available:');
            messages.notify('.');
            return;

          case 'name':
            return socket.emit('chat-set-name', { name: args });

          case 'unname':
            return socket.emit('chat-unset-name');

          case 'broadcast':
            return socket.emit('chat-broadcast', { text: args });

          case 'to':
            return messages.notify('todo: /to {name} {text}');

          case 'me':
          case 'emote':
            return socket.emit('chat-emote', { text: args });

          case 'test':
            return messages.notify('it works!');

          case 'hello':
            return messages.notify('hello world!');


          case 'slap':
            return messages.notify('todo: /slap {name}');

          default:
            messages.notify('\'' + command + '\' not implemented');
        };
      });

    $(users)
      .on('user-click', function(e, user) {
        // on user click, do something interactive
        if(!user.anon)
          input.write(' ' + user.name + ' ');
        input.focus();
      });

    // listen for socket events

    socket.on('chat-init', function(data) {

      // set client id
      id = data.id;

      // empty userlist
      users.clear();

      // add all users
      data.users.map(function(data) {
        users.set(new User(data, id));
      });

      // empty messages
      messages.clear();

      // add all messages
      data.messages.map(function(data) {
        messages.broadcast(data.text, new User(data.user, id));
      });
    });

    socket.on('chat-user-connected', function(data) {
      var user = new User(data.user, id);
      users.set(user);
      messages.notify(user.notifName() + ' connected');
    });

    socket.on('chat-user-disconnected', function(data) {
      var user = users.get(data.user.id);
      users.remove(data.user.id);
      messages.notify(user.notifName() + ' disconnected');
    });

    socket.on('chat-user-renamed', function(data) {
      var olduser = users.get(data.user.id);
      var newuser = new User(data.user, id);
      users.set(newuser);
      messages.notify(olduser.notifName() + ' is now ' + newuser.notifName());
    });

    socket.on('chat-broadcast', function(data) {
      var user = new User(data.user, id);
      messages.broadcast(data.text, user);
    });

    socket.on('chat-notification', function(data) {
      messages.notify(data.text);
    });

    // request initialization
    socket.emit('chat-init');

    // expose interface methods

    this.attach = function(target) {
      $(target).append($root);
      return app;
    };

    this.focus = function() {
      input.focus();
      return app;
    };
  };

  return App;
});
