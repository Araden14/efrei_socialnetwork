import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('chat:message', {
    senderId: 'user1',
    recipientId: 'user2',
    message: 'Hello there!',
    timestamp: new Date().toISOString(),
  });
});
