
var _ = require('underscore');

// message buffer
var Buffer = function(size) {

  var size = size || 10;
  var list = [];

  this.add = function(text, user) {
    list.push({ text: text, user: user});
    list = _.last(list, size);
  };

  this.read = function() {
    return list;
  };
};

module.exports = Buffer;
