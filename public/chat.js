
$(function(){
   	// Make connection
	var socket = io.connect('http://localhost:3000')

	// Buttons and inputs
	var form = jQuery('#myForm'),
		txt = jQuery('#message'),
		chatArea = jQuery('#chatArea'),
		username = $("#username"),
		send_username = $("#send_username"),
		feedback = $("#feedback");

	// Emit update username event
	var username = prompt('What\'s your username?');
	if(username !=  null && username != '') {
		// update username only when user clicks ok
		// if user click cancel then it will return null
		socket.emit('UPDATE_USERNAME', { username : username })		
	}

	// Emit new message
	form.submit(function(e) {
		e.preventDefault();
		socket.emit('NEW_MESSAGE', { message : txt.val() });
		txt.val('');
	});
	
	// Listen on new message
	socket.on("NEW_MESSAGE", (data) => {
		feedback.html('');
		chatArea.append('<div class="well">' + data.username + ": " + data.message + '</div>');
	});

	//Emit typing
	txt.bind("keypress", () => {
		socket.emit('TYPING')
	});

	//Listen on typing
	socket.on('TYPING', (data) => {
		feedback.html("<i>" + data.username + " is typing a message..." + "</i>")
	});
});