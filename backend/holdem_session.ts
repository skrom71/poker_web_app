import { Server as SocketServer, Socket } from "socket.io";

export type GameState = {
  session_id: number;
  seats: { [key: number]: Player | null };
  pot: number | null;
  community_cards: string[] | null;
  stage: Stage;
  current_player_id: string | null;
  dealer_id: string | null;
  previous_bet: number | null;
  blinds: { small_blind: number; big_blind: number } | null;
};

type Player = {
  id: string;
  name: string;
  stack: number;
  cards: string[] | null;
  bet: number | null;
  status: string;
  position: number;
};

type Stage =
  | "pending"
  | "blind"
  | "pre-flop"
  | "flop"
  | "turn"
  | "river"
  | "showdown";

// Инициализация состояния игры
const gameState: GameState = {
  session_id: 0,
  seats: {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
  },
  blinds: { small_blind: 25, big_blind: 50 },
  community_cards: [],
  pot: 10,
  dealer_id: null,
  current_player_id: null,
  previous_bet: 0,
  stage: "pending",
};

// Обработка игровых действий
function handlePlayerAction(
  socket: Socket,
  io: SocketServer,
  actionData: { playerId: string; action: string; betAmount?: number }
) {
  // const { playerId, action, betAmount = 0 } = actionData;
  // if (gameState.players) {
  //   const playerIndex: number = gameState.players?.findIndex(
  //     (p) => p.player_id === playerId
  //   );
  //   if (playerIndex !== -1) {
  //     const player = gameState.players[playerIndex];
  //     switch (action) {
  //       case "fold":
  //         player.status = "folded";
  //         break;
  //       case "call":
  //         if (gameState.previous_bet && gameState.pot) {
  //           const callAmount = gameState.previous_bet - player.bet;
  //           if (player.stack >= callAmount) {
  //             player.stack -= callAmount;
  //             player.bet += callAmount;
  //             gameState.pot += callAmount;
  //           }
  //         }
  //         break;
  //       case "bet":
  //         if ((player.stack >= betAmount, gameState.pot)) {
  //           player.stack -= betAmount;
  //           player.bet += betAmount;
  //           gameState.pot += betAmount;
  //           gameState.previous_bet = player.bet;
  //         }
  //         break;
  //     }
  //     gameState.current_player_index =
  //       (playerIndex + 1) % gameState.players.length;
  //     io.emit("gameState", gameState);
  //   }
  // }
}

// Инициализация Socket.IO
function initializePokerService(io: SocketServer) {
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    // Логика обработки нового соединения

    io.emit("gameState", gameState);

    socket.on("joinGame", (player) => {
      if (player) {
        gameState.seats[player.position] = player;
        io.emit("gameState", gameState);
      }
    });

    socket.on("playerAction", (data) => {
      handlePlayerAction(socket, io, data);
    });

    // Обработка отключения
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      Object.entries(gameState.seats).forEach(([key, value]) => {
        const numericKey = Number(key);
        if (
          gameState.seats[numericKey] &&
          socket.id === gameState.seats[numericKey].id
        ) {
          gameState.seats[numericKey] = null;
          return;
        }
      });
      io.emit("gameState", gameState);
    });
  });
}

export default initializePokerService;
