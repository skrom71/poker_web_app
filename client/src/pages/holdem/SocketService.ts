// socketService.ts
import { io, Socket } from "socket.io-client";
import { GameState } from "./types/Types";

let socket: Socket;

export const initializeSocket = (
  onGameStateUpdate: (data: GameState) => void,
  onConnect: (id: string) => void
) => {
  socket = io("http://localhost:3000");

  socket.on("connection", () => {
    socket.id && onConnect(socket.id);
  });

  socket.on("gameState", (data: GameState) => {
    onGameStateUpdate(data);
  });

  return socket;
};

export const joinGame = (playerId: string, position: number) => {
  socket.emit("joinGame", {
    id: playerId,
    name: `Игрок ${playerId}`,
    stack: 1500,
    cards: [],
    bet: 0,
    status: "active",
    position: position,
  });
};

export const playerAction = (
  playerId: string,
  action: string,
  betAmount: number = 0
) => {
  socket.emit("playerAction", { playerId, action, betAmount });
};

export const startRound = () => {
  socket.emit("startRound");
};

export const advanceStage = () => {
  socket.emit("advanceStage");
};

export const disconnectSocket = () => {
  socket.disconnect();
};
