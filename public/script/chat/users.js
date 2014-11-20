
define(['jquery', 'chat/templatizer'], function($, tpl) {

  var Users = function($root) {

    var mgr = this;

    var list = {};

    this.get = function(id) {

      // try to get user by id
      if(id in list) 
        return list[id].user;

      // fail
      return false;
    };

    this.set = function(user) {

      // create element
      var $o = $(tpl.user({
        name: user.name
      }));

      // mark active user
      if(user.active)
        $o.addClass('active');

      if(user.anon)
        $o.addClass('anonymous');

      // listen for events
      $o.on('click', function() {
        $(mgr).trigger('user-click', [user])
      });

      // add or replace element in DOM
      if(user.id in list) {
        list[user.id].$root.replaceWith($o);
      } else {
        $root.append($o);
      }

      // add or replace element in user dictionary
      list[user.id] = { user: user, $root: $o };
    };

    this.remove = function(id) {

      if(id in list) {

        // remove user DOM element
        list[id].$root.remove();

        // remove user from user dictionary
        delete list[id];
      }
    };

    this.clear = function() {

      // remove all users
      for(var k in list)
        this.remove(k);
    };
  };

  return Users;
});
