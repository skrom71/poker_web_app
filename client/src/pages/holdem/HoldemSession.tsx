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
import getCardImage from "../../components/cards";

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
                    src={getCardImage(cardName)}
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
      {Boolean(isCurrentPlayer) && (
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
