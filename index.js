'use strcit';

import express from 'express';
import socketIO from 'socket.io';
const app = express();

// Specifying the template engine
app.set('view engine', 'ejs');

// Setup the routes that are directly access
app.use(express.static('public'));

// Setup application routes
app.get('/', (req, res) => {
	res.render('index');
});

// Listening server on 3000 port
const server = app.listen(3000);
console.log("Application is running on http://localhost:3000");

// Creating websocket using socket.io
const io = socketIO(server);

// Creating an array that will store the connected user
const connections = [];

io.on('connection', (socket) => {
	// Storing new user connections into array
	connections.push(socket);
	console.log(' %s users is connected', connections.length);

	// Assign Default use name
	socket.username = "Anonymous User";

	// Listen the update username event
	socket.on('UPDATE_USERNAME', (data) => {
		// This code will execute when client
		// trigger the update username event
		socket.username = data.username
	});

	// Listen the new message event
	socket.on('NEW_MESSAGE', (data) => {
		// This code will execute when someone sends a message 
		io.emit('NEW_MESSAGE', {
			message: data.message,
			username: socket.username
		});
	});

	// Listen the typing event
	socket.on('TYPING', (data) => {
		// When client trigger typing event
		// at that time we send back username
		// by emitting typing event back
		socket.broadcast.emit('TYPING', {
			username: socket.username
		});
	});

	// Listen the disconnect event
	socket.on('disconnect', () => {
		// When client disconnect from chat
		connections.splice(connections.indexOf(socket), 1);
	});
});