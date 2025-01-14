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

  if (gameState && gameState.players && gameState.current_player_id) {
    isCurrentPlayer = gameState.current_player_id === playerId;
    isDealer = gameState.dealer_id === playerId;
  }

  const positions = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="main-container">
      <div className="poker-desk">
        <img src={pokerDeskImage} className="background-image"></img>
        {gameState && playerId && (
          <>
            {gameState.pot && (
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

            {gameState.players
              ? positions.map((position) => {
                  gameState.players?.forEach((player) => {
                    if (player.position === position) {
                      return (
                        <>
                          <div className={`player player-${position}`}>
                            <PlayerStatusBar
                              name={player.name}
                              stack={player.stack.toString()}
                              cards={player.cards}
                            />
                          </div>
                          {player.bet && (
                            <div
                              className={`player-bet player-${position}-bet`}
                            >
                              {player.bet}
                            </div>
                          )}
                        </>
                      );
                    } else {
                    }
                  });
                  return (
                    <div className={`player player-${position}`}>
                      <div className="join-button-container">
                        <button className="join-button">JOIN</button>
                      </div>
                    </div>
                  );
                })
              : positions.map((position) => (
                  <div className={`player player-${position}`}>
                    <div className="join-button-container">
                      <button
                        className="join-button"
                        onClick={() => handleJoinPlayer(playerId, position)}
                      >
                        JOIN
                      </button>
                    </div>
                  </div>
                ))}
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
