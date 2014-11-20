
define(['jquery', 'chat/templatizer'], function($, tpl) {

  var Messages = function($root) {

    var mgr = this;

    this.broadcast = function(text, user) {

      // create element
      var $o = $(tpl.message({ text: text, from: user.name }));
      
      if(user.active)
        $o.addClass('active');

      // add element to DOM
      $root.prepend($o);
    };

    this.notify = function(text) {

      // create element
      var $o = $(tpl.notification({ text: text }));

      // add element to DOM
      $root.prepend($o);
    };

    this.clear = function() {
      // clear messages
      $root.empty();
    };
  };

  return Messages;
});
