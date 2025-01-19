import { Server as SocketServer, Socket } from "socket.io";
import { determineWinner as winner } from "./holdem_winner";
import { emit } from "process";
const max_player = 7;

export type GameState = {
  session_id: number;
  players: Player[];
  pot: number;
  community_cards: string[];
  stage:
    | "pre-flop"
    | "flop"
    | "turn"
    | "river"
    | "showdown"
    | "finished"
    | null;
  current_player_id: number | undefined;
  dealer_id: number | undefined;
  previous_bet: number;
  blinds: { small_blind: number; big_blind: number };
  deck: string[];
};

export type Player = {
  id: string;
  name: string;
  stack: number;
  cards: string[];
  bet: number;
  status: string; // active, folded, disconneted, pending
  position: number;
};

// Инициализация состояния игры
const gameState: GameState = {
  session_id: 0,
  players: [],
  blinds: { small_blind: 25, big_blind: 50 },
  community_cards: [],
  pot: 0,
  dealer_id: undefined,
  current_player_id: undefined,
  previous_bet: 0,
  stage: null,
  deck: [],
};

function initializeDeck(): string[] {
  const suits = ["d", "h", "s", "c"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const deck: string[] = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push(`${rank}${suit}`);
    });
  });
  return deck.sort(() => Math.random() - 0.5);
}

function startNewRound(io: SocketServer): void {
  gameState.players = gameState.players.filter(
    (value) => value.status !== "disconnected"
  );

  gameState.players.forEach((player) => {
    player.status = "active";
  });

  gameState.players.sort((a, b) => a.position - b.position);

  if (gameState.players.length < 2) {
    console.log("Недостаточно игроков для начала игры.");
    gameState.players.forEach((value) => (value.status = "pending"));
    io.emit("gameState", gameState);
    return;
  }

  console.log(`gameState.dealer_id ${gameState.dealer_id}`);

  gameState.dealer_id =
    gameState.dealer_id === undefined
      ? 0
      : (gameState.dealer_id + 1) % gameState.players.length;

  clearDesk();

  console.log(`gameState.dealer_id ${gameState.dealer_id}`);

  gameState.stage = "pre-flop";
  gameState.deck = initializeDeck();

  const smallBlindIndex = (gameState.dealer_id + 1) % gameState.players.length;
  const bigBlindIndex = (smallBlindIndex + 1) % gameState.players.length;

  const smallBlind = gameState.blinds.small_blind;
  const bigBlind = gameState.blinds.big_blind;

  gameState.players[smallBlindIndex].stack -= smallBlind;
  gameState.players[smallBlindIndex].bet = smallBlind;

  gameState.players[bigBlindIndex].stack -= bigBlind;
  gameState.players[bigBlindIndex].bet = bigBlind;

  gameState.pot = smallBlind + bigBlind;
  gameState.previous_bet = bigBlind;

  gameState.players.forEach((player) => {
    player.cards = [gameState.deck.pop()!, gameState.deck.pop()!];
  });

  gameState.current_player_id = (bigBlindIndex + 1) % gameState.players.length;

  io.emit("gameState", gameState);
}

function clearDesk() {
  gameState.players.forEach((player) => {
    player.cards = [];
    player.bet = 0;
    // player.isDealer = false;
  });

  gameState.community_cards = [];
  gameState.pot = 0;
  // gameState.dealer_id = null;
  gameState.current_player_id = 0;
  gameState.previous_bet = 0;
  gameState.stage = null;
  gameState.deck = [];
}

function advanceGameStage(io: SocketServer): void {
  if (gameState.stage === "pre-flop") {
    gameState.stage = "flop";
    gameState.community_cards = [
      gameState.deck.pop()!,
      gameState.deck.pop()!,
      gameState.deck.pop()!,
    ];
  } else if (gameState.stage === "flop") {
    gameState.stage = "turn";
    gameState.community_cards.push(gameState.deck.pop()!);
  } else if (gameState.stage === "turn") {
    gameState.stage = "river";
    gameState.community_cards.push(gameState.deck.pop()!);
  } else if (gameState.stage === "river") {
    gameState.stage = "showdown";
    determineWinner(io);
  }

  io.emit("gameState", gameState);
}

function determineWinner(io: SocketServer): void {
  const activePlayers = gameState.players.filter(
    (player) => player.status === "active"
  );

  const winners = winner(activePlayers, gameState.community_cards);

  const pot = gameState.pot / winners.length;

  winners.forEach((winner) =>
    activePlayers.find((el) => el.id === winner && (el.stack += pot))
  );

  gameState.pot = 0;

  gameState.stage = "finished";

  // io.emit("gameState", gameState);
  startNewRound(io);
}

// Обработка игровых действий
function handlePlayerAction(
  io: SocketServer,
  socket: Socket,
  actionData: { playerId: string; action: string; betAmount?: number }
) {
  const { playerId, action, betAmount = 0 } = actionData;

  const joinedPlayers = gameState.players.filter(
    (value) => value.status !== "pending"
  );

  const playerIndex = joinedPlayers.findIndex(
    (player) => player.id === playerId
  );

  if (playerIndex === -1) {
    console.error(`Игрок с ID ${playerId} не найден.`);
    return;
  }

  const player = joinedPlayers[playerIndex];

  switch (action) {
    case "fold":
      handlePlayerFold(io, socket);
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

  if (joinedPlayers.filter((value) => value.status === "active").length === 1) {
    player.stack += gameState.pot;
    clearDesk();
    startNewRound(io);
  } else {
    gameState.current_player_id = (playerIndex + 1) % joinedPlayers.length;

    if (gameState.current_player_id === gameState.dealer_id) {
      advanceGameStage(io);
    }

    while (
      gameState.players[gameState.current_player_id].status ===
        "disconnected" ||
      gameState.players[gameState.current_player_id].status === "folded"
    ) {
      gameState.current_player_id =
        (gameState.current_player_id + 1) % joinedPlayers.length;
    }
  }

  io.emit("gameState", gameState);
}

function handlePlayerFold(io: SocketServer, socket: Socket) {
  // const joinedPlayers = gameState.players.filter(
  //   (value) => value.status !== "pending"
  // );

  let index = gameState.players.findIndex((player) => player.id === socket.id);

  if (gameState.players[index]) {
    gameState.players[index].status = "folded";
    gameState.players[index].cards = [];
  }
}

function handlePlayerDisconnect(io: SocketServer, socket: Socket) {
  const joinedPlayers = gameState.players.filter(
    (value) => value.status !== "pending"
  );

  let index = joinedPlayers.findIndex((player) => player.id === socket.id);

  if (gameState.players[index]) {
    gameState.players[index].status = "disconnected";
    gameState.players[index].cards = [];

    if (gameState.current_player_id === index) {
      while (gameState.players[index].status === "disconnected") {
        index = (index + 1) % joinedPlayers.length;
      }

      gameState.current_player_id = index;
    }

    if (gameState.current_player_id === gameState.dealer_id) {
      advanceGameStage(io);
    } else {
      io.emit("gameState", gameState);
    }
  } else {
    let index = gameState.players.findIndex(
      (player) => player.id === socket.id
    );
    if (
      gameState.players[index] &&
      gameState.players[index].status === "pending"
    ) {
      gameState.players.splice(index, 1);
      io.emit("gameState", gameState);
    }
  }

  const activePlayers = joinedPlayers.filter(
    (value) => value.status === "active"
  );

  console.log(`activePlayer ${activePlayers.length}`);

  if (activePlayers.length === 1) {
    activePlayers[0].stack += gameState.pot;
    clearDesk();
    io.emit("gameState", gameState);
    startNewRound(io);
  }
}

function handlePlayerJoin(player: Player, io: SocketServer, socket: Socket) {
  gameState.players.push(player);
  io.emit("gameState", gameState);

  if (gameState.stage == null || gameState.stage === "finished") {
    startNewRound(io);
  }
}

// Инициализация Socket.IO
function initializePokerService(io: SocketServer) {
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    // Логика обработки нового соединения

    io.emit("gameState", gameState);

    socket.on("joinGame", (data) => {
      const player = data as Player;
      handlePlayerJoin(player, io, socket);
    });

    socket.on("playerAction", (data) => {
      console.log("playerAction");
      handlePlayerAction(io, socket, data);
    });

    // Обработка отключения
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      handlePlayerDisconnect(io, socket);
    });
  });
}

export default initializePokerService;
