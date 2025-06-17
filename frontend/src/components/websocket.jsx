import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import "./websocket.css"

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    const userid = 1;
    const socket = io(import.meta.env.VITE_API_HOST, {
      query: { userid : 1 }
    });

    socket.on('chat:init', (data) => {
      console.log('Received chat:init:', data);
      setMessages(data.messages);
      setChats(data.chats);
      setUsers(data.users);
    });

    socket.on('chat:newmessage', (message) => {
      console.log('Received chat:newMessage:', message);
      setMessages(prev => [...prev, message]);
      setChats(prev => [...prev, message.chatid]);
      setUsers(prev => [...prev, message.userid]);
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

  // Group messages by chatid
  const messagesByChat = messages.reduce((acc, msg) => {
    if (!acc[msg.chatid]) acc[msg.chatid] = [];
    acc[msg.chatid].push(msg);
    return acc;
  }, {});

  // Handler for chat click
  function handleChatClick(chatid) {
    setSelectedChatId(chatid);
  }

  // Get sorted messages for selected chat
  const selectedMessages = selectedChatId && messagesByChat[selectedChatId]
    ? [...messagesByChat[selectedChatId]].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : [];

  let chatlist = chats.map((chat) => (
    <div
      className={"websocket-chatitem" + (selectedChatId === chat.id ? " selected" : "")}
      key={chat.id}
      onClick={() => handleChatClick(chat.id)}
      style={{ cursor: 'pointer' }}
    >
      <span>Chat no {chat.id}</span>
      <h2>{chat.title}</h2>
    </div>
  ));

  return (
    <div className="websocket-chatlist">
      {chatlist}
      {selectedChatId && (
        <div className="websocket-messages">
          <h3>Messages for Chat {selectedChatId}</h3>
          {selectedMessages.length === 0 ? (
            <div>No messages.</div>
          ) : (
            <ul>
              {selectedMessages.map(msg => (
                <li key={msg.id}>
                  <strong>User {msg.userid}:</strong> {msg.content} <span style={{color:'#888', fontSize:'0.85em'}}>({msg.timestamp})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default WebSocketComponent;
