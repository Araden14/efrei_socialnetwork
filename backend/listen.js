// listen.js

// On utilise socket.io-client pour se connecter au WebSocket du backend Nest
const { io } = require("socket.io-client");

// Remplacez localhost par l'adresse appropriée si votre backend tourne dans Docker
const socket = io(process.env.API_HOST);

// Quand la connexion WebSocket est établie, on logue l’ID du socket
socket.on("connect", () => {
  console.log("✅ Connecté au WebSocket, socket id:", socket.id);
});

// On écoute l’événement “newMessage” envoyé par le backend
socket.on("newMessage", (message) => {
  console.log("🔔 Nouveau message reçu via WebSocket : ", message);
});

// Optionnel : loguer quand on se déconnecte
socket.on("disconnect", () => {
  console.log("🔌 Déconnecté du WebSocket");
});
