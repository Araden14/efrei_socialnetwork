import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MessagingApp from './components/MessagingApp'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'
import WebSocketComponent from './components/websocket'

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) setUser({ token });
    if (!token && user) setUser(null);
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/messagerie"
          element={
            user ? <MessagingApp user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            !user ? <Login onLogin={setUser} /> : <Navigate to="/messagerie" />
          }
        />
        <Route
          path="/register"
          element={
            !user ? <Register onRegister={setUser} /> : <Navigate to="/messagerie" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/messagerie" : "/login"} />}
        />
        <Route
        path="/websocket"
        element={<WebSocketComponent />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App