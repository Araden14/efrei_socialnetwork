import React, { useState } from 'react';
import './Login.css';

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && name.trim() && password.trim()) {
      onRegister({ email, name, password });
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
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;