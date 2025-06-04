import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const REGISTER_MUTATION = gql`
  mutation Register($data: CreateUserInput!) {
    register(data: $data) {
      access_token
    }
  }
`;

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [register, { data, loading, error }] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.register && data.register.access_token) {
      // Optionnel : stocker le token
      localStorage.setItem('token', data.register.access_token);
      // Appelle le callback pour mettre à jour le user dans App.jsx
      if (onRegister) {
        onRegister({ token: data.register.access_token, email, name });
      }
      navigate('/messagerie');
    }
  }, [data, navigate, onRegister, email, name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() && name.trim() && password.trim()) {
      await register({ variables: { data: { email, name, password } } });
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Créer un compte</h2>
        <p style={{textAlign: "center", color: "#666", margin: "0 0 8px 0", fontSize: "1rem"}}>
          Inscrivez-vous pour accéder à la messagerie professionnelle
        </p>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <button type="submit" disabled={loading}>S'inscrire</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error.message}</div>}
        {data && <div style={{ color: 'green', marginTop: 8 }}>Inscription réussie !</div>}
      </form>
    </div>
  );
};

export default Register;