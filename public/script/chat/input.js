
define(['jquery'], function($) {

  var Input = function($root) {

    var mgr = this;

    $input = $('input', $root);

    $input.on('keypress', function(e) {
      if(e.which === 13)
        mgr.submit();
    });

    this.read = function() {
      return $input.val();
    };

    this.write = function(s) {
      $input.val(this.read() + s);
    };

    this.clear = function() {
      $input.val('');
    };

    this.submit = function() {
      var s = mgr.read();
      mgr.clear();
      $(mgr).trigger('input', [s]);
    };

    this.focus = function() {
      $input.focus();
    };
  };

  return Input;
});
