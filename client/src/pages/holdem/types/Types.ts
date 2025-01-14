export type GameState = {
  session_id: number;
  players: Player[] | null;
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
  position: Position;
  name: string;
  stack: number;
  cards: string[] | null;
  bet: number | null;
  status: string;
};

type Blind = {
  small_blind: string;
  big_blind: string;
};

type Stage =
  | "pending"
  | "blind"
  | "pre-flop"
  | "flop"
  | "turn"
  | "river"
  | "showdown";

type Position = 1 | 2 | 3 | 4 | 5 | 6 | 7;
