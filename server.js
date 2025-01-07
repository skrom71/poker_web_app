import express from "express";
import { Server } from "socket.io";
import http from "http";
// import cors from "cors";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const LOCAL_IP = "172.31.16.214";

// const LOCAL_ID = "localhost";

//const corsOptions = {
//   origin: "http://3.142.149.178", // Разрешить запросы только с вашего фронтенда
//   methods: ["GET", "POST"],
//   allowedHeaders: ["Content-Type"],
//};

// Используем CORS middleware
//app.use(cors(corsOptions));

// Обработка HTTP-запросов
app.get("/", (req, res) => {
  res.send("Привет! Это HTTP-запрос.");
});

// Обработка HTTP-запросов
app.get("/api", (req, res) => {
  res.send("!API не добавлен");
});

let tableState = [null, null, null, null];

// Интегрируем WebSocket-сервер с Express

// Настройка CORS для Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Разрешить все источники, или укажите конкретные домены
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Разрешить отправку cookies (если нужно)
  },
});

io.on("connection", (socket) => {
  console.log("Socket ID:", socket.id);

  io.emit("tableState", tableState);

  socket.on("sitDown", ({ userId, seatIndex }) => {
    if (tableState[seatIndex] === null) {
      tableState[seatIndex] = userId;
      console.log("A user sitDown", userId);
      io.emit("tableState", tableState);
    } else {
      socket.emit("error", "This seat is already occupied!");
    }
  });

  socket.on("leave", ({ userId, seatIndex }) => {
    if (tableState[seatIndex] === userId) {
      tableState[seatIndex] = null;
      io.emit("tableState", tableState);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    tableState = tableState.map((seat) => (seat === socket.id ? null : seat));
    io.emit("tableState", tableState);
  });
});

// HTTP сервер слушает на порту 3000
server.listen(PORT, () => {
  console.log("Server running on http://${LOCAL_IP}:${PORT}");
});
