import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
    query: {
        userId: 1,
    },
});

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('chat:sendmessage', {
    senderid: 1,
    chatid: 1,
    content: 'Hello there!',
  });
  socket.on('chat:init', (data) => {
    console.log('Chat initialized', data);
  });
});
