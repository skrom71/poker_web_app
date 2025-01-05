import express from "express";
import { Server } from "socket.io";
// import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const LOCAL_ID = "0.0.0.0";

// const LOCAL_ID = "localhost";

// const corsOptions = {
//   origin: "http://localhost:5173", // Разрешить запросы только с вашего фронтенда
//   methods: ["GET", "POST"],
//   allowedHeaders: ["Content-Type"],
// };

// // Используем CORS middleware
// app.use(cors(corsOptions));

// Запускаем сервер Express
const server = app.listen(PORT, LOCAL_ID, () => {
  console.log(`Сервер запущен на http://${LOCAL_ID}:${PORT}`);
});

// Обработка HTTP-запросов
app.get("/", (req, res) => {
  res.send("Привет! Это HTTP-запрос.");
});

let tableState = [null, null, null, null];

// Интегрируем WebSocket-сервер с Express
const io = new Server(server);

// // Настройка CORS для WebSocket-сервера
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173', // URL вашего фронтенда
//     methods: ['GET', 'POST'],
//   },
// });

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
