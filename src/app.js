var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

//Read client into memory
var index = fs.readFileSync(__dirname + '/../client/client.html');

//Handle http requests
function onRequest(request, response) {

 response.writeHead(200, {"Content-Type": "text/html"});
 response.write(index);
 response.end();
}
var app = http.createServer(onRequest).listen(port);

console.log("Listening...");

//pass in the http server into socketio and grab the websocket server as io
var io = socketio(app);

var onJoined = function(socket) {
	socket.on("join", function(data) {
		socket.join('room1');
	});
};

var onMsg = function(socket) {
	socket.on('draw', function(data) {
		io.sockets.in('room1').emit('draw', data);
	});
};

var onDisconnect = function(socket) {
	socket.on("disconnect", function(data) {
		socket.leave('room1');
	});
};

process.stdin.on('data', function(data) {
	if(data.toString().trim() == "clear"){
		io.sockets.in('room1').emit('clear', data);
	}
});

io.sockets.on("connection", function(socket) {
	onJoined(socket);
	onMsg(socket);
	onDisconnect(socket);
});