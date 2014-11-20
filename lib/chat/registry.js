
// client registry
var Registry = function() {

  var items = {};

  this.add = function(client) {
    items[client.id()] = client;
  };

  this.remove = function(client) {
    delete items[client.id()];
  };

  this.read = function() {
    var res = [];
    for(var k in items)
      res.push(items[k].user());
    return res;
  };
};

module.exports = Registry;
