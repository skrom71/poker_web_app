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
  status: string;
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
