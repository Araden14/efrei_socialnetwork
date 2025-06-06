import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Send, User, Search, Phone, Video, MoreVertical } from 'lucide-react';
import './MessagingApp.css';
import { gql, useMutation } from '@apollo/client';

const SOCKET_URL = 'http://localhost:4000';

const MessagingApp = ({ user, onLogout }) => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [avatar] = useState('👥'); // Default avatar
  const [socket, setSocket] = useState(null);

  const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($data: CreateMessageInput!) {
      sendMessage(data: $data)
    }
  `;
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  const handleSendMessage = () => {
    sendMessage({
      variables: {
        data: {
          chatid: selectedChat.id,
          userid: user?.id,
          content: newMessage,
          timestamp: new Date().toISOString(),
        },
      },
    });
  };

  useEffect(() => {
    const sock = io(SOCKET_URL, { query: { userid: user?.id } });
    setSocket(sock);

    sock.on('chat:init', (data) => {
      setMessages(data.messages);
      setChats(data.chats);
      setUsers(data.users);
    });

    sock.on('chat:newmessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    sock.on('connect', () => {
      // Optionally handle connection
    });
    sock.on('disconnect', () => {
      // Optionally handle disconnect
    });

    return () => {
      sock.disconnect();
    };
  }, [user]);

  // Group messages by chatId for efficient lookup
  const messagesByChat = messages.reduce((acc, msg) => {
    if (!acc[msg.chatid]) acc[msg.chatid] = [];
    acc[msg.chatid].push(msg);
    return acc;
  }, {});

  const handleDeleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat(null);
    }
  };

  const handleLogout = async () => { 
    localStorage.removeItem('token');
    if (onLogout) onLogout();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  // When a chat is selected, set the selectedChat object
  const handleSelectChat = (chat) => setSelectedChat(chat);

  // Get sorted messages for selected chat
  const getChatMessages = (chatId) => {
    const msgs = messagesByChat[chatId] || [];
    return [...msgs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  return (
    <div className="messaging-app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Messages</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button
            className="new-chat-btn"
            onClick={() => setShowNewChat(true)}
          >
            + Nouvelle conversation
          </button>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="search-input"
            />
          </div>
        </div>
        {showNewChat && (
          <form
            className="new-chat-form"
            onSubmit={e => {
              e.preventDefault();
              if (newChatName.trim()) {
                // Optionally emit to server to create new chat
                setShowNewChat(false);
                setNewChatName('');
              }
            }}
            style={{ padding: '10px' }}
          >
            <input
              type="text"
              placeholder="Nom de la conversation"
              value={newChatName}
              onChange={e => setNewChatName(e.target.value)}
              style={{ marginRight: 8, padding: 4 }}
              required
            />
            <button type="submit">Créer</button>
            <button type="button" onClick={() => setShowNewChat(false)} style={{ marginLeft: 4 }}>Annuler</button>
          </form>
        )}
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`chat-item${selectedChat?.id === chat.id ? ' active' : ''}`}
              style={{ position: 'relative' }}
            >
              <div className="chat-avatar-container">
                <div className="chat-avatar">{avatar}</div>
                {chat.online && <div className="online-indicator"></div>}
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <span className="chat-name">{chat.title || chat.name}</span>
                  <span className="chat-time">{chat.timestamp}</span>
                </div>
                <p className="last-message">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="unread-badge">{chat.unread}</div>
              )}
              <button
                className="delete-chat-btn"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
                title="Supprimer la conversation"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="main-chat">
        {selectedChat ? (
          <>
            <div className="chat-header-bar">
              <div className="chat-user-info">
                <div className="header-avatar-container">
                  <div className="header-avatar">{selectedChat.avatar || avatar}</div>
                  {selectedChat.online && <div className="online-indicator"></div>}
                </div>
                <div className="user-details">
                  <h2>{selectedChat.title || selectedChat.name}</h2>
                  <div className="status">
                    {selectedChat.online ? 'En ligne' : 'Hors ligne'}
                  </div>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-btn"><Phone /></button>
                <button className="action-btn"><Video /></button>
                <button className="action-btn"><MoreVertical /></button>
              </div>
            </div>
            <div className="messages-container">
              {getChatMessages(selectedChat.id).map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.userid === (user?.id || 1) ? 'message-me' : 'message-other'}`}
                >
                  <div className="message-bubble">
                    <p>{message.content}</p>
                    <span className="message-time">{new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="message-input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="message-input"
              />
              <button onClick={handleSendMessage} className="send-btn">
                <Send />
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">💬</div>
              <h3>Sélectionnez une conversation</h3>
              <p>Choisissez une conversation dans la liste pour commencer à chatter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingApp;