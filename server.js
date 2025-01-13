import express from "express";
import { Server } from "socket.io";
import http from "http";
// import cors from "cors";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// const LOCAL_IP = "172.31.16.214";

const LOCAL_IP = "localhost";

// Обработка HTTP-запросов
app.get("/", (req, res) => {
  res.send("Привет! Это HTTP-запрос.");
});

// Обработка HTTP-запросов
app.get("/api", (req, res) => {
  res.send("!API не добавлен");
});

// Настройка CORS для Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Разрешить все источники, или укажите конкретные домены
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Разрешить отправку cookies (если нужно)
  },
});

// Инициализация состояния игры
let gameState = {
  session_id: 4234,
  players: [
    {
      player_id: "player1",
      player_position: "top-1",
      name: "Игрок 2",
      stack: 1200,
      cards: ["2H", "7S"],
      bet: 154300,
      status: "active",
    },
    {
      player_id: "player2",
      player_position: "top-2",
      name: "Игрок 2",
      stack: 1200,
      cards: ["2H", "7S"],
      bet: 25500,
      status: "active",
    },
    {
      player_id: "player3",
      player_position: "left-1",
      name: "Игрок 3",
      stack: 3000,
      cards: ["10C", "JC"],
      bet: 35350,
      status: "active",
    },
    {
      player_id: "player4",
      player_position: "left-2",
      name: "Игрок 4",
      stack: 4000,
      cards: ["9D", "KS"],
      bet: 453450,
      status: "active",
    },
    {
      player_id: "player5",
      player_position: "right-1",
      name: "Игрок 5",
      stack: 5305,
      cards: ["10C", "JC"],
      bet: 55535,
      status: "active",
    },
    {
      player_id: "player6",
      player_position: "right-2",
      name: "Игрок 6",
      stack: 6000,
      cards: ["10C", "JC"],
      bet: 6640,
      status: "active",
    },
    {
      player_id: "player7",
      player_position: "bottom-1",
      name: "Игрок 7",
      stack: 7000,
      cards: ["10C", "JC"],
      bet: 7450,
      status: "active",
    },
  ],
  blinds: {
    min: 25,
    max: 50,
  },
  community_cards: ["KH", "9D", "4S", "4C", "8D"],
  current_round: "flop",
  pot: 457,
  dealer_player_id: "player1",
  current_player_id: "player2",
  previous_bet: 100,
  stage: "post-flop",
};

io.on("connection", (socket) => {
  console.log("Socket ID:", socket.id);

  io.emit("gameState", gameState);

  // socket.on("sitDown", ({ userId, seatIndex }) => {
  //   if (tableState[seatIndex] === null) {
  //     tableState[seatIndex] = userId;
  //     console.log("A user sitDown", userId);
  //     io.emit("tableState", tableState);
  //   } else {
  //     socket.emit("error", "This seat is already occupied!");
  //   }
  // });

  // socket.on("leave", ({ userId, seatIndex }) => {
  //   if (tableState[seatIndex] === userId) {
  //     tableState[seatIndex] = null;
  //     io.emit("tableState", tableState);
  //   }
  // });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected:", socket.id);
  //   tableState = tableState.map((seat) => (seat === socket.id ? null : seat));
  //   io.emit("tableState", tableState);
  // });
});

// HTTP сервер слушает на порту 3000
server.listen(PORT, () => {
  console.log(`Server running on http://${LOCAL_IP}:${PORT}`);
});
