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
        console.log("socket id: " + socket.id + player);
        console.log(player);
        return (
          <div key={key}>
            <div className={"player player-" + player.player_position}>
              <PlayerStatusBar
                playerData={player}
                isCurrent={gameState.current_player_id == player.player_id}
              />
            </div>
            <div className={"player-" + player.player_position + "-bet"}>
              {/* {player.bet} */}4423423.23
            </div>
          </div>
        );
      })}
      {/* <div className="player player-top-1">
        <PlayerStatusBar isCurrent={true} />
      </div>
      <div className="player-top-1-bet">34.4</div>
      <div className="player player-top-2">
        <JoinButton />
      </div>
      <div className="player player-left-1">
        <PlayerStatusBar isCurrent={false} />
      </div>
      <div className="player-left-1-bet">34334.4</div>
      <div className="player player-left-2">
        <JoinButton />
      </div>
      <div className="player player-left-3">
        <PlayerStatusBar isCurrent={false} />
      </div>
      <div className="player player-right-1">
        <PlayerStatusBar isCurrent={false} />
      </div>
      <div className="player player-right-2">
        <JoinButton />
      </div>
      <div className="player player-right-3">
        <PlayerStatusBar isCurrent={false} />
      </div>
      <div className="player player-bottom-1">
        <PlayerStatusBar isCurrent={false} />
      </div>
      <div className="player player-bottom-2">
        <JoinButton />
      </div> */}

      <div className="pot">
        <img src={ChipIcon} className="pot-icon" />
        {/* {gameState.pot} */}443.3
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
