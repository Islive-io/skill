

var app = require('express')();
var serveStatic = require('serve-static');
var http = require('http').Server(app);

app.get('/', function(request, response) {
    response.sendFile(__dirname + "/public/views/index.html")
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});