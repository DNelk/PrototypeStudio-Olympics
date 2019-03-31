var path = require('path');
var socketio = require('socket.io');
var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || process.env.NODE_PORT || 3000;
var app = express();
var socketio = require('socket.io');

app.use('/assets', express.static(path.resolve(__dirname+'../../client/')));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended:true}));
var server = app.listen(port, function(err) {
	if (err) {
		throw err;
	}
	console.log('Listening on port ' + port);
});

//pass in the http server into socketio and grab the websocket server as io
var io = socketio(server);

//Router
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