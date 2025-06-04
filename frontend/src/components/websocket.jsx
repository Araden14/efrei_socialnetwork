import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
  useEffect(() => {
    const userid = 1;
    const socket = io('http://localhost:4000', {
      query: { userid : 1 }
    });

    socket.on('chat:init', (data) => {
      console.log('Received chat:init:', data);
      setMessages(data.messages);
      setChats(data.chats);
      setUsers(data.users);
    });

    socket.on('chat:newMessage', (message) => {
      console.log('Received chat:newMessage:', message);
      setMessages([...messages, message]);
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('message', (message) => {
      console.log('Received message:', message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Component</h1>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>{message.content}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>{chat.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
