// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var redis = require('redis');
var redisClient = redis.createClient();


server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    response.sendFile(__dirname + "/public/views/index.html");
});

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;
var messages = [];

io.on('connection', function (socket) {
    var addedUser = false;

    // Store messages in array
    var storeMessage = function(name, data) {
        // Turn object into string to store in redis
        var message = JSON.stringify({name: name, data: data});

        redisClient.lpush("messages", message, function(err, response) {
            // Keep latest 10 items
            redisClient.ltrim("messages", 0, 10);
        });
    }

    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
        storeMessage(socket.username, data);
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username) {
        redisClient.lrange("messages", 0, -1, function(err, messages) {
            // emit in the right order
            messages = messages.reverse();

            messages.forEach(function(message) {
                // parse into JSON object
                message = JSON.parse(message);
                socket.emit("older messages", { username: message.name, message: message.data });
            });
        });

        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        // remove the username from global usernames list
        if (addedUser) {
            delete usernames[socket.username];
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});