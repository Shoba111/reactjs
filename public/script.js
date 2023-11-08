// script.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Connect to the server

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    // Update poll results when a new vote is received
    socket.on('poll-update', (updatedPollResults) => {
        console.log('Poll results updated', updatedPollResults);
        for (const [option, count] of Object.entries(updatedPollResults)) {
            const pollCountElement = document.getElementById('poll-count-${option}');
            if (pollCountElement) {
                pollCountElement.textContent = count;
            }
        }
    });

    // Add new chat messages when they are received
    socket.on('chat-message', (data) => {
        const chatMessagesElement = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.textContent = '${data.username}: ${data.message}';
        chatMessagesElement.appendChild(messageElement);
        chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
    });

    // Send a vote when the vote button is clicked
    const voteButton = document.getElementById('vote-button');
    voteButton.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="poll-option"]:checked');
        if (selectedOption) {
            console.log('Emitting vote for option:', selectedOption.value);
            socket.emit('vote', selectedOption.value);
        } else {
            console.error('No option selected');
        }
    });

    // Send a chat message when the send button is clicked
    const sendMessageButton = document.getElementById('send-message-button');
    sendMessageButton.addEventListener('click', () => {
        const messageInput = document.getElementById('chat-message-input');
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('chat-message', { username: 'Anonymous', message: message });
            messageInput.value = '';
        }
    });
});
