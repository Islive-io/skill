var app = require('express')();
var serveStatic = require('serve-static');
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var routes = require('./routes/index');

app.use(serveStatic(path.join(__dirname, 'public')));

// TODO: get routes working with view engine
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', '{views}');
//app.use('/', routes);

/* GET home page. */
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
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

//module.exports = app;