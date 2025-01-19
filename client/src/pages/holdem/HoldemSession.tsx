import { useState, useEffect } from "react";
import {
  initializeSocket,
  joinGame,
  playerAction,
  startRound,
  advanceStage,
  disconnectSocket,
} from "./SocketService";
import pokerDeskImage from "/src/assets/images/poker-desk.png";
import chip1 from "/src/assets/images/chip-1.png";
import PlayerStatusBar from "../../components/PlayerStatusBar";
import { GameState, Player } from "./types/Types";
import "./HoldemSession.css";
import dealerIcon from "/src/assets/images/chip-2.png";

// Тип для карты
interface Card {
  card: string;
  path: string;
}

const images: Card[] = [
  { card: "2s", path: "/src/assets/images/cards/2s.png" },
  { card: "3s", path: "/src/assets/images/cards/3s.png" },
  { card: "4s", path: "/src/assets/images/cards/4s.png" },
  { card: "5s", path: "/src/assets/images/cards/5s.png" },
  { card: "6s", path: "/src/assets/images/cards/6s.png" },
  { card: "7s", path: "/src/assets/images/cards/7s.png" },
  { card: "8s", path: "/src/assets/images/cards/8s.png" },
  { card: "9s", path: "/src/assets/images/cards/9s.png" },
  { card: "10s", path: "/src/assets/images/cards/10s.png" },
  { card: "Js", path: "/src/assets/images/cards/Js.png" },
  { card: "Qs", path: "/src/assets/images/cards/Qs.png" },
  { card: "Ks", path: "/src/assets/images/cards/Ks.png" },
  { card: "As", path: "/src/assets/images/cards/As.png" },
  { card: "2h", path: "/src/assets/images/cards/2h.png" },
  { card: "3h", path: "/src/assets/images/cards/3h.png" },
  { card: "4h", path: "/src/assets/images/cards/4h.png" },
  { card: "5h", path: "/src/assets/images/cards/5h.png" },
  { card: "6h", path: "/src/assets/images/cards/6h.png" },
  { card: "7h", path: "/src/assets/images/cards/7h.png" },
  { card: "8h", path: "/src/assets/images/cards/8h.png" },
  { card: "9h", path: "/src/assets/images/cards/9h.png" },
  { card: "10h", path: "/src/assets/images/cards/10h.png" },
  { card: "Jh", path: "/src/assets/images/cards/Jh.png" },
  { card: "Qh", path: "/src/assets/images/cards/Qh.png" },
  { card: "Kh", path: "/src/assets/images/cards/Kh.png" },
  { card: "Ah", path: "/src/assets/images/cards/Ah.png" },
  { card: "2d", path: "/src/assets/images/cards/2d.png" },
  { card: "3d", path: "/src/assets/images/cards/3d.png" },
  { card: "4d", path: "/src/assets/images/cards/4d.png" },
  { card: "5d", path: "/src/assets/images/cards/5d.png" },
  { card: "6d", path: "/src/assets/images/cards/6d.png" },
  { card: "7d", path: "/src/assets/images/cards/7d.png" },
  { card: "8d", path: "/src/assets/images/cards/8d.png" },
  { card: "9d", path: "/src/assets/images/cards/9d.png" },
  { card: "10d", path: "/src/assets/images/cards/10d.png" },
  { card: "Jd", path: "/src/assets/images/cards/Jd.png" },
  { card: "Qd", path: "/src/assets/images/cards/Qd.png" },
  { card: "Kd", path: "/src/assets/images/cards/Kd.png" },
  { card: "Ad", path: "/src/assets/images/cards/Ad.png" },
  { card: "2c", path: "/src/assets/images/cards/2c.png" },
  { card: "3c", path: "/src/assets/images/cards/3c.png" },
  { card: "4c", path: "/src/assets/images/cards/4c.png" },
  { card: "5c", path: "/src/assets/images/cards/5c.png" },
  { card: "6c", path: "/src/assets/images/cards/6c.png" },
  { card: "7c", path: "/src/assets/images/cards/7c.png" },
  { card: "8c", path: "/src/assets/images/cards/8c.png" },
  { card: "9c", path: "/src/assets/images/cards/9c.png" },
  { card: "10c", path: "/src/assets/images/cards/10c.png" },
  { card: "Jc", path: "/src/assets/images/cards/Jc.png" },
  { card: "Qc", path: "/src/assets/images/cards/Qc.png" },
  { card: "Kc", path: "/src/assets/images/cards/Kc.png" },
  { card: "Ac", path: "/src/assets/images/cards/Ac.png" },
];

function Card(cardName: string): string {
  const card = images.find((c) => c.card === cardName);

  if (!card) return "Карта не найдена";

  return card.path;
}

const HoldemSession: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const socket = initializeSocket(
      (data: GameState) => setGameState(data),
      (id: string) => setPlayerId(id)
    );

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleAction = (action: string, betAmount: number = 0) => {
    if (playerId) {
      playerAction(playerId, action, betAmount);
    }
  };

  // const handleStartRound = () => {
  //   startRound();
  // };

  // const handleAdvanceStage = () => {
  //   advanceStage();
  // };

  const handleJoinPlayer = (playerId: string, position: number) => {
    if (playerId) {
      joinGame(playerId, position);
    }
  };

  if (!gameState) {
    return <div>Loading...</div>;
  }

  const positions = [1, 2, 3, 4, 5, 6, 7];

  let isCurrentPlayer: boolean | null = null;
  // let isDealer: boolean | null = null;

  if (gameState.current_player_id !== undefined) {
    isCurrentPlayer =
      gameState.players[gameState.current_player_id]?.id === playerId;
  }

  // if (gameState.dealer_id !== undefined) {
  //   isDealer = gameState.players[gameState.dealer_id]?.id === playerId;
  // }

  let joinedPlayer: Player | undefined;

  if (Boolean(gameState) !== null) {
    joinedPlayer = gameState.players.find((player) => player.id === playerId);
  }

  // if (joinedPlayer !== undefined && joinedPlayer.status === "folded") {
  //   handleAction("");
  // }

  return (
    <div className="main-container">
      <div className="poker-desk">
        <img src={pokerDeskImage} className="background-image"></img>
        {gameState && playerId && (
          <>
            {Boolean(gameState.pot) &&
              Boolean((gameState.pot as number) > 0) && (
                <div className="pot">
                  <img src={chip1} className="pot-icon" />
                  {gameState.pot}
                </div>
              )}

            {gameState.blinds && (
              <div className="blinde">
                Min.Max: {gameState.blinds.small_blind}/
                {gameState.blinds.big_blind}
              </div>
            )}

            {gameState.community_cards && (
              <div className="commun-card-container">
                {gameState.community_cards.map((cardName) => (
                  <img
                    key={cardName}
                    src={Card(cardName)}
                    className="commun-card"
                  ></img>
                ))}
              </div>
            )}

            {positions.map((position) => {
              let playerByPosition: Player | undefined = gameState.players.find(
                (player) => player.position === position
              );

              if (playerByPosition !== undefined) {
                let stack =
                  playerByPosition.status !== "active"
                    ? playerByPosition.status
                    : playerByPosition.stack.toString();
                return (
                  <>
                    <div
                      className={`player player-${playerByPosition.position}`}
                    >
                      <PlayerStatusBar
                        name={playerByPosition.name}
                        stack={stack}
                        cards={
                          playerByPosition.id === playerId
                            ? playerByPosition.cards
                            : []
                        }
                      />
                    </div>
                    {Boolean(playerByPosition.bet) &&
                      Boolean((playerByPosition.bet as number) > 0) && (
                        <div
                          className={`player-bet player-${playerByPosition.position}-bet`}
                        >
                          {playerByPosition.bet}
                        </div>
                      )}
                    {gameState.dealer_id !== undefined &&
                      gameState.players[gameState.dealer_id] &&
                      playerByPosition.id ===
                        gameState.players[gameState.dealer_id].id && (
                        <div
                          className={`player-dealer player-${playerByPosition.position}-dealer`}
                        >
                          <img src={dealerIcon} className="pot-icon"></img>
                        </div>
                      )}
                  </>
                );
              } else if (joinedPlayer !== undefined) {
                return (
                  <div className={`player player-${position}`}>
                    <div className="invite-button-container">
                      <button className="invite-button">Invite</button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className={`player player-${position}`}>
                    <div className="join-button-container">
                      <button
                        className="join-button"
                        onClick={() => handleJoinPlayer(playerId, position)}
                      >
                        {position} JOIN
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </>
        )}
      </div>
      {isCurrentPlayer && (
        <div className="toolbar">
          <button
            onClick={() => handleAction("fold")}
            className="toolbar-button red"
          >
            Fold
          </button>
          <button
            onClick={() => handleAction("check")}
            className="toolbar-button green"
          >
            Check
          </button>
          <button
            onClick={() => handleAction("call")}
            className="toolbar-button green"
          >
            Call
          </button>
          <button
            onClick={() => handleAction("bet", 100)}
            className="toolbar-button green"
          >
            Bet 100
          </button>
        </div>
      )}
    </div>
  );
};

export default HoldemSession;
