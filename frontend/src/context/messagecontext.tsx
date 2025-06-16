import { createContext, useContext, useState } from "react";

interface UserType {
    id: number;
    name: string;
    email: string;
}

interface Chat {
    id: number;
    title: string;
    users: UserType[];
    Message: Message[];
}

interface Message {
    id: number;
    content: string;
    timestamp: string;
    userid: number;
    chatid: number;
}


interface MessageContextValue {
    users: UserType[]   
    setUsers: (users: UserType[]) => void
    chats: Chat[]
    setChats: (chats: Chat[]) => void
    messages: Message[]
    setMessages: (messages: Message[]) => void
  }
const MessageContext = createContext<MessageContextValue | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<UserType[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    return <MessageContext.Provider value={{ users, setUsers, chats, setChats, messages, setMessages }}>{children}</MessageContext.Provider>;
}

export function useMessage() {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
}