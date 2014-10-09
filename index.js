var app = require('express')();
var serveStatic = require('serve-static');
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(serveStatic(path.join(__dirname, 'public')));

app.get('/', function(request, response) {
    response.sendFile(__dirname + "/public/views/index.html");
});

io.on('connection', function(socket){
    io.emit('new user', 'NEW USER LOGGED IN');
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    socket.on('new user', function(msg){
        io.emit('new user', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});