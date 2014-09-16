var express  = require("express");
var socketio = require("socket.io");
var http 	 = require("http");
var path 	 = require("path");

var APP_OPTIONS = {
	serverPort: 80,
    assetPath: path.join(__dirname, "/assets"),
	viewOptions: {
		root: path.join(__dirname, "/templates/views/")
	}
};

// ----------------------------------------------------------------------

var app    = express();
var server = http.Server(app);
var io     = socketio(server);
var log    = [];

io.on('connection', function(socket){
    console.log('a user connected');

    // Awesome database.
    // Todo: A real database.
    for (var i = 0; i < log.length; i++) {
        socket.emit("onMessage", log[i]);
    }

    socket.on("onMessage", function(messageObject) {
        console.log(messageObject.nickname + ": " + messageObject.message);

        log.push(messageObject);

        while (log.length > 10) {
            log.shift();
        }

        io.emit("onMessage", messageObject);
    });
});

// ----------------------------------------------------------------------

app.use("/assets", express.static(APP_OPTIONS.assetPath));

app.get("/", function (request, response) {
	response.sendFile("index.html", APP_OPTIONS.viewOptions);
});

server.listen(APP_OPTIONS.serverPort, function () {
	console.log("Server running on localhost: " + APP_OPTIONS.serverPort);
});



