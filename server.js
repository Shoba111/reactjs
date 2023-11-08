// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Object to store the poll results
let pollResults = {
    option1: 0,
    option2: 0,
    option3: 0
};

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send initial poll results to the client
    socket.emit('poll-update', pollResults);

    // Handle vote event from client
    socket.on('vote', (option) => {
        if (pollResults.hasOwnProperty(option)) {
            pollResults[option]++;
            console.log(`Vote received for ${option}. New count: ${pollResults[option]}`);
            // Emit the updated results to all clients
            io.emit('poll-update', pollResults);
        } else {
            console.log('Received invalid vote option:', option);
        }
    });

    // Handle chat message event from client
    socket.on('chat-message', (msg) => {
        // Broadcast the chat message to all clients
        io.emit('chat-message', msg);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
