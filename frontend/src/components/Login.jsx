import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      onLogin({ email, password });
    }
  };

  
// fetch('http://localhost:4000/graphql', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     query: `
//       mutation Login($username: String!, $password: String!) {
//         login(username: $username, password: $password) {
//           token
//           user { id username }
//         }
//       }
//     `,
//     variables: {
//       username: 'alice',
//       password: 'motdepasse'
//     }
//   })
// })
//   .then(res => res.json())
//   .then(data => {
//     // data.data.login contient le token et l'utilisateur
//   });

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <p style={{textAlign: "center", color: "#666", margin: "0 0 8px 0", fontSize: "1rem"}}>
          Accédez à votre messagerie professionnelle
        </p>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
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