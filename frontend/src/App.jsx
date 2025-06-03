import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MessagingApp from './components/MessagingApp'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
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
          path="/messagerie"
          element={
            user ? <MessagingApp user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/messagerie" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App