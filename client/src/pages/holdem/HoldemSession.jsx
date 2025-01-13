import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./HoldemSession.css";
import PlayerStatusBar from "../../components/PlayerStatusBar.jsx";
import JoinButton from "../../components/buttons/PokerTableJoinButton.jsx";
import ChipIcon from "/src/assets/images/chip-1.png";

const socket = io("http://localhost:3000");

function HoldemSession() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    // Подписка на обновления состояния игры
    socket.on("gameState", (data) => {
      setGameState(data);
    });

    return () => {
      socket.off("gameState");
    };
  }, []);

  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-container-session">
      {gameState.players.map((player, key) => {
        return (
          <div key={key}>
            <div className={"player player-" + player.player_position}>
              <PlayerStatusBar
                playerData={player}
                isCurrent={gameState.current_player_id == player.player_id}
              />
            </div>
            <div
              className={"player-bet player-" + player.player_position + "-bet"}
            >
              {player.bet}
            </div>
          </div>
        );
      })}

      <div className="pot">
        <img src={ChipIcon} className="pot-icon" />
        {gameState.pot}
      </div>

      <div className="blinde">
        Min.Max: {gameState.blinds.min}/{gameState.blinds.max}
      </div>

      <div className="commun-card-container">
        {gameState.community_cards.map((cardName) => (
          <img
            key={cardName}
            src={"/src/assets/images/" + cardName + ".png"}
            className="commun-card"
          ></img>
        ))}
      </div>
    </div>
  );
}

export default HoldemSession;
