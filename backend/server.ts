import express from "express"; // Импортируем express
import http from "http";
import { Server as SocketServer } from "socket.io";
import apiRouter from "./api_service"; // Подключение API роутов
import initializePokerService from "./holdem_session"; // Подключение сервиса игры в покер

const app = express(); // Типизируется автоматически как express.Application
const server = http.createServer(app); // Создаем HTTP сервер с app

const io = new SocketServer(server, {
  cors: {
    origin: "*", // Разрешение кросс-доменных запросов
  },
});

const PORT = process.env.PORT || 3000;
const LOCAL_IP = "localhost";

// Пример использования Request и Response через глобальный express
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Привет! Это HTTP-запрос.");
});

// Подключаем API роуты
app.use("/api", apiRouter);

// Инициализация WebSocket сервиса
initializePokerService(io);

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Server running on http://${LOCAL_IP}:${PORT}`);
});
