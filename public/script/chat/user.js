
// user
define(function() {

  var User = function(data, id) {

    this.active = data.id == id;
    this.anon = !data.name.length;
    this.name = this.anon ? 'anonymous' : data.name;
    this.id = data.id;

    this.notifName = function() {
      return this.anon ? 'an anonymous user' : '\'' + this.name + '\'';
    };
  };

  return User;
});