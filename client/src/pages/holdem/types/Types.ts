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
  blinds: null,
  community_cards: [],
  pot: 0,
  dealer_id: null,
  current_player_id: null,
  previous_bet: 0,
  stage: "pending",
};
