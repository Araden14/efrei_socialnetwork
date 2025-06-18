import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send, User, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useAuth } from '../context/authcontext';
import './MessagingApp.css';
import { useMessage } from '../context/messagecontext';

interface MessagingAppProps {
  onLogout: () => void;
}

interface Message {
  id: number;
  content: string;
  timestamp: string;
  userid: number;
  chatid: number;
}

interface UserType {
  id: number;
  email: string;
  name: string;
  posts?: Chat[];
  Message?: Message[];
}

interface Chat {
  id: number;
  title: string;
  users: UserType[];
  Message: Message[];
  otherUser?: UserType;
  newMessage?: boolean;
}

interface CreateChatInput {
  title: string;
  userIds: number[];
}

interface CreateMessageInput {
  userid: number;
  chatid: number;
  content: string;
}

interface CreateChatResponse {
  createChat: Chat;
}

interface UsersQueryResponse {
  users: UserType[];
}

interface MessagesByChat {
  [chatId: number]: Message[];
}

interface ChatInitData {
  messages: Message[];
  chats: Chat[];
  users: UserType[];
}

const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

const DELETE_CHAT = gql`
  mutation DeleteChat($id: Int!) {
    deleteChat(id: $id) {
      id
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($data: CreateChatInput!) {
    createChat(data: $data) {
      id
      title
      users { id name email }
      Message { id content timestamp userid chatId }
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($data: CreateMessageInput!) {
    sendMessage(data: $data) {
      user
      chat
      content
      timestamp
    }
  }
`;

const MessagingApp: React.FC<MessagingAppProps> = ({ onLogout }) => {
  const { user: authUser } = useAuth();
  const { messages, setMessages, chats, setChats, users, setUsers } = useMessage();
  const [showNewChat, setShowNewChat] = useState<boolean>(false);
  const [newChatName, setNewChatName] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [selectedUser2, setSelectedUser2] = useState<string>('');
  const [avatar] = useState<string>('👥');
  const [socket, setSocket] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [createChat] = useMutation<CreateChatResponse, { data: CreateChatInput }>(CREATE_CHAT);
  const [getUsers, { data: usersData }] = useLazyQuery<UsersQueryResponse>(GET_USERS, { fetchPolicy: 'network-only' });
  const [sendMessage] = useMutation<any, { data: CreateMessageInput }>(SEND_MESSAGE_MUTATION);
  const [deleteChat] = useMutation<any, { id: number }>(DELETE_CHAT);
  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_HOST, {
      query: { userid: authUser?.id }
    });

    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
    newSocket.on('chat:delete', (id: number) => {
      console.log('Received chat:delete', id);
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    });

    newSocket.on('chat:init', (data: ChatInitData) => {
      console.log('Received chat:init:', data);
      if (data.messages) setMessages(data.messages);
      if (data.users) setUsers(data.users)
      if (data.chats){
        const newChats = data.chats.map(chat => {
          const otherUser = data.users.find(user => user.id !== chat.users[0].id);
          return {
            ...chat,
            otherUser: otherUser,
            newMessage: false
          }
        })  
        setChats(newChats);
      }
    });

    newSocket.on('chat:newmessage', (message: Message) => {
      console.log('Received chat:newmessage:', message);
      setMessages((prev: Message[]) => [...prev, message]);
      setChats(prevChats => prevChats.map(chat => 
        chat.id === message.chatid ? { ...chat, newMessage: true } : chat
      ));
    });

    newSocket.on('chat:newchat', (chat: Chat) => {
      console.log('Received chat:newchat:', chat);
      // @ts-ignore
      const otherUserId = chat.users.find(userid => userid !== authUser.id)
      console.log(otherUserId);
      if (otherUserId) {
        // @ts-ignore
        const otherUserInfo = retrieveUserinfo(otherUserId);
        const newChat = {
          ...chat,
          otherUser: otherUserInfo
        };
        console.log(newChat);
        setChats(prevChats => [...prevChats, newChat]);
      }
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [authUser?.id, setMessages, setChats, setUsers]);

  // Add new useEffect for scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat, messages]);

  const handleShowNewChat = (): void => {
    setShowNewChat(true);
    getUsers();
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !selectedChat) return;

    const result = await sendMessage({
      variables: {
        data: {
          chatid: selectedChat.id,
          userid: parseInt(authUser?.id || '0'),
          content: newMessage,
        },
      },
    });
    setNewMessage('')
  };

  // Group messages by chatId for efficient lookup
  const messagesByChat: MessagesByChat = messages.reduce((acc, msg) => {
    if (!acc[msg.chatid]) acc[msg.chatid] = [];
    acc[msg.chatid].push(msg);
    return acc;
  }, {} as MessagesByChat);

  const retrieveUserinfo = (userid: number): UserType | undefined => {
    return users.find(user => user.id === userid);
  };

  const handleDeleteChat = (chatId: number): void => {
    deleteChat({ variables: { id: chatId } }); 
    setChats(chats.filter(chat => chat.id !== chatId));
    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat(null);
    }
  };

  const handleLogout = async (): Promise<void> => { 
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    if (onLogout) onLogout();
  };

  const handleCreateChat = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newChatName.trim() || !selectedUser2) return;

    if (parseInt(authUser?.id || '0') === parseInt(selectedUser2)) {
      alert("Vous ne pouvez pas créer une conversation avec vous-même.");
      return;
    }

    try {
      const result = await createChat({
        variables: {
          data: {
            title: newChatName,
            userIds: [parseInt(authUser?.id || '0'), parseInt(selectedUser2)],
          }
        }
      });
      setShowNewChat(false);
      setNewChatName('');
      setSelectedUser2('');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleSelectChat = (chat: Chat): void => setSelectedChat(chat);

  const getChatMessages = (chatId: number): Message[] => {
    const msgs = messagesByChat[chatId] || [];
    return [...msgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const handleNewChatNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewChatName(e.target.value);
  };

  const handleSelectedUser2Change = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedUser2(e.target.value);
  };

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewMessage(e.target.value);
  };

  const handleCancelNewChat = (): void => {
    setShowNewChat(false);
  };

  return (
    <div className="messaging-app">
      {/* Affichage de l'id utilisateur connecté */}
      <div style={{position: 'absolute', top: 10, right: 20, fontSize: 13, color: '#888'}}>
        Connecté en tant que : <b>{authUser?.email}</b>
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
              onChange={handleNewChatNameChange}
              style={{ marginRight: 8, padding: 4 }}
              required
            />
             <select
              value={selectedUser2}
              onChange={handleSelectedUser2Change}
              required
              style={{ marginRight: 8, padding: 4, marginTop: 10 }}
            >
              <option value="">Sélectionner un utilisateur</option>
              {usersData?.users
                ?.filter(u => String(u.id) !== String(authUser?.id))
                .map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </select>
            <div>
              <button type="submit" style={{ height: 27.5 }} >Créer</button>
              <button type="button" onClick={handleCancelNewChat} style={{ marginLeft: 4 }}>Annuler</button>
            </div>
          </form>
        )}
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                handleSelectChat(chat);
                setChats((prevChats) =>
                  prevChats.map((c) =>
                    c.id === chat.id ? { ...c, newMessage: false } : c
                  )
                );
              }}
              className={`chat-item${selectedChat?.id === chat.id ? ' active' : ''} ${chat.newMessage ? 'new-message' : ''}`}
            >
              <div className="chat-avatar-container">
                <div className="chat-avatar">{avatar}</div>
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <span className="chat-name">{chat.title}</span>
                  <span className="other-user-name">{chat.otherUser?.name}</span>
                </div>
              </div>
              <button
                className="delete-chat-btn"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
              <h3>{selectedChat.title} - {selectedChat.otherUser?.name}</h3>
              <div className="chat-user-info">
                <div className="header-avatar-container"></div>
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
                  className={`message ${message.userid === parseInt(authUser?.id || '0') ? 'message-me' : 'message-other'}`}
                >
                  <div className="message-bubble">
                    <p>{message.content}</p>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="message-input-container">
              <input
                type="text"
                value={newMessage}
                onChange={handleNewMessageChange}
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