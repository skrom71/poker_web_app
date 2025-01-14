import { useState, useEffect } from "react";
import "./PlayerStatusBar.css";
import BackCardIcon from "/src/assets/images/card-back.png";

interface PlayerStatusBarProps {
  name: string;
  cards: string[] | null;
  stack: string;
}

function PlayerStatusBar({ name, cards, stack }: PlayerStatusBarProps) {
  let card1Path: string;
  let card2Path: string;

  if (cards !== null) {
    card1Path = "/src/assets/images/" + cards[0] + ".png";
    card2Path = "/src/assets/images/" + cards[1] + ".png";
  } else {
    card1Path = BackCardIcon;
    card2Path = BackCardIcon;
  }

  return (
    <div className="main-container-status-bar">
      <img src={card1Path} className="player-status-bar-card1"></img>
      <img src={card2Path} className="player-status-bar-card2"></img>
      <div className="player-status-bar-footer">
        <div className="player-status-bar-name">{name}</div>
        <div className="player-status-bar-balance">{stack}</div>
      </div>
    </div>
  );
}

export default PlayerStatusBar;
