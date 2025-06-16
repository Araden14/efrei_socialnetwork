import React, { createContext, useContext, useState, ReactNode } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { redirect } from 'react-router-dom';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface RegisterInput {
  name: string;
  password: string;
  email: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterMutationResponse {
  access_token: string;
}

interface LoginMutationResponse {
  access_token: string;
}

interface VerifyTokenQueryResponse {
  verifyToken: AuthUser;
}

interface AuthContextValue {
  setUser: (user: AuthUser | null) => void;
  user: AuthUser | null;
  register: (registerInput: RegisterInput) => Promise<void>;
  logout: () => void;
  login: (loginInput: LoginInput) => Promise<void>;
  verifyToken: (access_token: string) => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      access_token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($data: CreateUserInput!) {
    register(data: $data) {
      access_token
    }
  }
`;

const VERIFY_TOKEN_QUERY = gql`
  query VerifyToken($access_token: String!) {
    verifyToken(access_token: $access_token) {
      id
      email
      name
    }
  }
`;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [registerMutation] = useMutation<RegisterMutationResponse, { data: RegisterInput }>(
    REGISTER_MUTATION
  );

  const [loginMutation] = useMutation<LoginMutationResponse, { data: LoginInput }>(
    LOGIN_MUTATION
  );

  const [verifyTokenQuery] = useLazyQuery<VerifyTokenQueryResponse, { access_token: string }>(
    VERIFY_TOKEN_QUERY
  );

  async function register(registerInput: RegisterInput) {
    await registerMutation({
      variables: { data: registerInput },
      context: { fetchOptions: { credentials: 'include' } }
    });
  }

  async function login(loginInput: LoginInput) {
    await loginMutation({
      variables: { data: loginInput },
      context: { fetchOptions: { credentials: 'include' } }
    });
    redirect("/")
    
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
  }

  async function verifyToken(access_token: string) {
    const { data } = await verifyTokenQuery({ variables: { access_token } });
    setUser(data?.verifyToken || null);
    return data?.verifyToken || null;
  }

  return (
    <AuthContext.Provider value={{ user, logout, login, register, verifyToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
