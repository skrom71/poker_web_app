import { useState, useEffect } from "react";
import "./PlayerStatusBar.css";
import BackCardIcon from "/src/assets/images/card-back.png";

function PlayerStatusBar({ playerData, isCurrent }) {
  function renderTag() {
    let card1Path;
    let card2Path;
    if (isCurrent) {
      card1Path = "/src/assets/images/" + playerData.cards[0] + ".png";
      card2Path = "/src/assets/images/" + playerData.cards[1] + ".png";
    } else {
      card1Path = BackCardIcon;
      card2Path = BackCardIcon;
    }

    console.log("card1Path: " + card1Path);
    console.log("card2Path: " + card2Path);

    return (
      <div className="main-container-status-bar">
        <img src={card1Path} className="player-status-bar-card1"></img>
        <img src={card2Path} className="player-status-bar-card2"></img>
        <div className="player-status-bar-footer">
          <div className="player-status-bar-name">{playerData.name}</div>
          <div className="player-status-bar-balance">{playerData.stack}</div>
        </div>
      </div>
    );
  }

  return renderTag(playerData, isCurrent);
}

export default PlayerStatusBar;
