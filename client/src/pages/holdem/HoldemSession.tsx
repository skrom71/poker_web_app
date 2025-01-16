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
import { GameState } from "./types/Types";
import "./HoldemSession.css";

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

  const handleStartRound = () => {
    startRound();
  };

  const handleAdvanceStage = () => {
    advanceStage();
  };

  const handleJoinPlayer = (playerId: string, position: number) => {
    if (playerId) {
      joinGame(playerId, position);
    }
  };

  if (!gameState) {
    return <div>Loading...</div>;
  }

  let isCurrentPlayer: boolean | null = null;
  let isDealer: boolean | null = null;

  // if (gameState && gameState.players && gameState.current_player_id) {
  //   isCurrentPlayer = gameState.current_player_id === playerId;
  //   isDealer = gameState.dealer_id === playerId;
  // }

  let isJoined: boolean = false;

  if (gameState.seats && playerId) {
    Object.entries(gameState.seats).forEach(([key, value]) => {
      const numericKey = Number(key);
      if (
        gameState.seats[numericKey] &&
        playerId === gameState.seats[numericKey].id
      ) {
        isJoined = true;
      }
    });
  }

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

            {gameState.community_cards &&
              gameState.community_cards.map((cardName) => (
                <img
                  key={cardName}
                  src={"/src/assets/images/" + cardName + ".png"}
                  className="commun-card"
                ></img>
              ))}
            {Object.entries(gameState.seats).map(([key, value]) => {
              const numericKey = Number(key);
              if (gameState.seats[numericKey]) {
                return (
                  <>
                    <div
                      className={`player player-${gameState.seats[numericKey].position}`}
                    >
                      <PlayerStatusBar
                        name={gameState.seats[numericKey].name}
                        stack={gameState.seats[numericKey].stack.toString()}
                        cards={gameState.seats[numericKey].cards}
                      />
                    </div>
                    {Boolean(gameState.seats[numericKey].bet) &&
                      Boolean(
                        (gameState.seats[numericKey].bet as number) > 0
                      ) && (
                        <div
                          className={`player-bet player-${gameState.seats[numericKey].position}-bet`}
                        >
                          {gameState.seats[numericKey].bet}
                        </div>
                      )}
                  </>
                );
              } else if (isJoined) {
                return (
                  <div className={`player player-${numericKey}`}>
                    <div className="invite-button-container">
                      <button className="invite-button">Invite</button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className={`player player-${numericKey}`}>
                    <div className="join-button-container">
                      <button
                        className="join-button"
                        onClick={() => handleJoinPlayer(playerId, numericKey)}
                      >
                        JOIN
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
          7
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
