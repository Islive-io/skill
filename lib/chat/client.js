
// TODO: some sort of unique id that won't run out
var mkid = (function() {
  var count = 0;
  return function() {
    return 'id-' + count++; 
  };
})();

// chat client
var Client = function(app, socket) {

  var client = this;

  var id = mkid();
  var name = '';

  this.id = function() {
    return id;
  };

  this.name = function() {
    return name;
  };

  this.user = function() {
    return {
      id: id,
      name: name
    };
  };

  this.notify = function(text) {
    socket.emit('chat-notification', {
      text: text,
    });
  };

  this.init = function() {

    app.connect(client);

    // modify event handler to require username to be set
    var guard = function(f) {
      return function() {
        if(name.length)
          return f.apply(this, Array.prototype.slice.call(arguments));
        client.notify('anons can\'t talk, set your name using: /name {name}');
      };
    };

    // client requests initialization data
    socket.on('chat-init', function() {
      socket.emit('chat-init', {
        users: app.getUsers(),
        messages: app.getBuffer(),
        id: id
      });
    });

    // client sets username
    socket.on('chat-set-name', function(data) {

      // replace series of non-word characters by hyphens; trim hyphens from boundaries
      var newname = data.name.replace(/[^\w]+/g, '-').replace(/^-+|-+$/g,'');

      // apply some limits
      if(newname.length < 3 || newname.length > 24)
        return client.notify('name must be between 3 and 24 characters long');

      if(newname == name)
        return client.notify('you are already using that name');

      // TODO: refuse duplicate names

      // set name
      name = newname;

      // notify of name change
      app.rename(client);
    });

    // client wants to be anonymous
    socket.on('chat-unset-name', function() {
      if(!name.length)
        return client.notify('you are already anonymous');
      name = '';
      app.rename(client);
    });
    
    // client broadcasts message
    socket.on('chat-broadcast', guard(function(data) {
      app.broadcast(data.text, client);
    }));

    // client broadcasts emote
    socket.on('chat-emote', guard(function(data) {
      app.notify(name + ' ' + data.text);
    }));

    socket.on('disconnect', function(data) {
      app.disconnect(client);
    });
  };
};

module.exports = Client;
