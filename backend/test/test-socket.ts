import { io } from 'socket.io-client';

function getTimestamp(): string {
  return new Date().toISOString();
}

const socketUser1 = io(process.env.API_HOST), {
  query: {
    userid: 1,
  },
});

const socketUser2 = io(process.env.API_HOST), {
  query: {
    userid: 2,
  },
});

socketUser1.on('connect', () => {
  console.log(`[${getTimestamp()}] User 1 Connected`);
  socketUser1.on('chat:newmessage', (data) => {
    console.log(`[${getTimestamp()}] User 1 received message:`, data);
  });
  socketUser1.emit('chat:sendmessage', {
    senderid: 1,
    chatid: 1,
    content: 'Hello User 2, this is User 1!',
    timestamp: getTimestamp(),
  });
});

socketUser2.on('connect', () => {
  console.log(`[${getTimestamp()}] User 2 Connected`);
  socketUser2.on('chat:newmessage', (data) => {
    console.log(`[${getTimestamp()}] User 2 received message:`, data);
    if (data.senderid === 1) {
      setTimeout(() => {
        socketUser2.emit('chat:sendmessage', {
          senderid: 2,
          chatid: 1,
          content: 'Hi User 1, User 2 here. I got your message!',
          timestamp: getTimestamp(),
        });
      }, 1000);
    }
  });
});

socketUser1.on('disconnect', () => {
  console.log(`[${getTimestamp()}] User 1 Disconnected`);
});

socketUser2.on('disconnect', () => {
  console.log(`[${getTimestamp()}] User 2 Disconnected`);
});

socketUser1.on('connect_error', (err) => {
  console.error(`[${getTimestamp()}] User 1 connection error:`, err.message);
});

socketUser2.on('connect_error', (err) => {
  console.error(`[${getTimestamp()}] User 2 connection error:`, err.message);
});

setTimeout(() => {
  console.log(`[${getTimestamp()}] Closing test sockets.`);
  socketUser1.close();
  socketUser2.close();
}, 5000);
