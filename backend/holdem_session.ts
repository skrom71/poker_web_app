import { Server as SocketServer, Socket } from "socket.io";

interface GameState {
  session_id: number;
  players: any[] | null;
  blinds: any | null;
  community_cards: string[] | null;
  current_round: any | null;
  pot: number | null;
  dealer_index: number | null;
  current_player_index: number | null;
  previous_bet: number | null;
  stage: string | null;
}

// Инициализация состояния игры
const gameState: GameState = {
  session_id: 0,
  players: [],
  blinds: null,
  community_cards: [],
  current_round: null,
  pot: 0,
  dealer_index: null,
  current_player_index: null,
  previous_bet: 0,
  stage: null,
};

// Обработка игровых действий
function handlePlayerAction(
  socket: Socket,
  io: SocketServer,
  actionData: { playerId: string; action: string; betAmount?: number }
) {
  const { playerId, action, betAmount = 0 } = actionData;

  if (gameState.players) {
    const playerIndex: number = gameState.players?.findIndex(
      (p) => p.player_id === playerId
    );

    if (playerIndex !== -1) {
      const player = gameState.players[playerIndex];

      switch (action) {
        case "fold":
          player.status = "folded";
          break;
        case "call":
          if (gameState.previous_bet && gameState.pot) {
            const callAmount = gameState.previous_bet - player.bet;
            if (player.stack >= callAmount) {
              player.stack -= callAmount;
              player.bet += callAmount;
              gameState.pot += callAmount;
            }
          }

          break;
        case "bet":
          if ((player.stack >= betAmount, gameState.pot)) {
            player.stack -= betAmount;
            player.bet += betAmount;
            gameState.pot += betAmount;
            gameState.previous_bet = player.bet;
          }
          break;
      }

      gameState.current_player_index =
        (playerIndex + 1) % gameState.players.length;
      io.emit("gameState", gameState);
    }
  }
}

// Инициализация Socket.IO
function initializePokerService(io: SocketServer) {
  io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on("joinGame", (player) => {
      console.log("Player joined game", player);
      gameState.players?.push(player);
      io.emit("gameState", gameState);
    });

    socket.on("playerAction", (data) => {
      handlePlayerAction(socket, io, data);
    });

    socket.on("disconnect", () => {
      console.log(`Player disconnected: ${socket.id}`);
    });
  });
}

export default initializePokerService;
