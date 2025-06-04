import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      access_token
    }
  }
`;

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (data && data.login && data.login.access_token) {
      localStorage.setItem('token', data.login.access_token);
      if (onLogin) {
        onLogin({ token: data.login.access_token, email });
      }
    }
  }, [data, onLogin, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      await login({ variables: { data: { email, password } } });
    }
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
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>Se connecter</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error.message}</div>}
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