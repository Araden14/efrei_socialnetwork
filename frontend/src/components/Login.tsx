import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useAuth } from '../context/authcontext';
import Cookies from 'js-cookie'

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, verifyToken, user, setUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    async function checkAuth() {
      // Try to get access_token from cookies
      const access_token = Cookies.get('access_token');
      if (access_token) {
        const user = await verifyToken(access_token);
        if (user){
          navigate('/')
        }
      }
    }
    checkAuth();
  }, []);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      await login({ email, password });
      navigate('/')
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <p style={{textAlign: "center", color: "#666", margin: "0 0 8px 0", fontSize: "1rem"}}>
          Accédez à votre messagerie professionnelle
        </p>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Se connecter</button>
        <p style={{textAlign: "center", marginTop: 10}}>
          <Link to="/register" style={{ color: "#2563eb", textDecoration: "underline" }}>
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login; 