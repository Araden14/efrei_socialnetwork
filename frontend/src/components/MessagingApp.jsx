import React, { useState } from 'react';
import { Send, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import './MessagingApp.css';

const GET_USERS = gql`
  query {
    users {
      id
      name
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($data: CreateChatInput!) {
    createChat(data: $data) {
      id
      title
      users { id name }
    }
  }
`;

const MessagingApp = ({ user, onLogout }) => {
  // Récupération de l'id du user connecté depuis le localStorage
  const userId = localStorage.getItem('userid');

  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [selectedUser2, setSelectedUser2] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, chatId: 1, sender: 'Alice', content: 'Salut ! Comment ça va ?', timestamp: '10:30', isMe: false },
    { id: 2, chatId: 1, sender: 'Moi', content: 'Ça va bien merci ! Et toi ?', timestamp: '10:32', isMe: true },
    { id: 3, chatId: 1, sender: 'Alice', content: 'Super ! On se voit toujours ce soir ?', timestamp: '10:35', isMe: false },
    { id: 4, chatId: 2, sender: 'Bob', content: 'Hey ! Tu as vu le match hier ?', timestamp: '09:15', isMe: false },
    { id: 5, chatId: 2, sender: 'Moi', content: 'Oui, incroyable !', timestamp: '09:20', isMe: true },
  ]);

  const [avatar, setAvatar] = useState('👥');
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Alice Martin',
      lastMessage: 'Super ! On se voit toujours ce soir ?',
      timestamp: '10:35',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Bob Dupont',
      lastMessage: 'Oui, incroyable !',
      timestamp: '09:20',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Groupe Projet',
      lastMessage: 'Meeting demain à 14h',
      timestamp: 'Hier',
      unread: 5,
      online: true
    }
  ]);

  const [createChat] = useMutation(CREATE_CHAT);
  const [getUsers, { data: usersData }] = useLazyQuery(GET_USERS, { fetchPolicy: 'network-only' });

  const handleShowNewChat = () => {
    setShowNewChat(true);
    getUsers();
  };

  const handleDeleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat(null);
    }
  };

  const handleLogout = async () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    if (onLogout) onLogout();
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const newMsg = {
        id: messages.length + 1,
        chatId: selectedChat.id,
        sender: 'Moi',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getChatMessages = (chatId) => {
    return messages.filter(msg => msg.chatId === chatId);
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    if (!newChatName.trim() || !selectedUser2) return;

    if (parseInt(userId) === parseInt(selectedUser2)) {
      alert("Vous ne pouvez pas créer une conversation avec vous-même.");
      return;
    }

    await createChat({
      variables: {
        data: {
          title: newChatName,
          userIds: [parseInt(userId), parseInt(selectedUser2)],
        }
      }
    });

    setShowNewChat(false);
    setNewChatName('');
    setSelectedUser2('');
  };

  return (
    <div className="messaging-app">
      {/* Affichage de l'id utilisateur connecté */}
      <div style={{position: 'absolute', top: 10, right: 20, fontSize: 13, color: '#888'}}>
        ID utilisateur connecté : <b>{userId}</b>
      </div>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Messages</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button
            className="new-chat-btn"
            onClick={handleShowNewChat}
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
            onSubmit={handleCreateChat}
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
            <select
              value={selectedUser2}
              onChange={e => setSelectedUser2(e.target.value)}
              required
              style={{ marginRight: 8, padding: 4, marginTop: 10 }}
            >
              <option value="">Sélectionner un utilisateur</option>
              {usersData?.users
                ?.filter(u => String(u.id) !== String(userId))
                .map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </select>
            <div>
              <button type="submit" style={{ height: 27.5 }} >Créer</button>
              <button type="button" onClick={() => setShowNewChat(false)} style={{ marginLeft: 4 }}>Annuler</button>
            </div>
          </form>
        )}
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`chat-item${selectedChat?.id === chat.id ? ' active' : ''}`}
              style={{ position: 'relative' }}
            >
              <div className="chat-avatar-container">
                <div className="chat-avatar">{avatar}</div>
                {chat.online && <div className="online-indicator"></div>}
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <span className="chat-name">{chat.name}</span>
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
                  <div className="header-avatar">{selectedChat.avatar}</div>
                  {selectedChat.online && <div className="online-indicator"></div>}
                </div>
                <div className="user-details">
                  <h2>{selectedChat.name}</h2>
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
                  className={`message ${message.isMe ? 'message-me' : 'message-other'}`}
                >
                  <div className="message-bubble">
                    <p>{message.content}</p>
                    <span className="message-time">{message.timestamp}</span>
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