import { useState, useEffect } from "react";
import "./PlayerStatusBar.css";
import BackCardIcon from "/src/assets/images/card-back.png";
import getCardImage from "./cards";

interface PlayerStatusBarProps {
  name: string;
  cards: string[];
  stack: string;
  // isDealer: Boolean;
}

function PlayerStatusBar({ name, cards, stack }: PlayerStatusBarProps) {
  let card1Path: string;
  let card2Path: string;

  if (cards !== null && cards.length > 0) {
    card1Path = getCardImage(cards[0]);
    card2Path = getCardImage(cards[1]);
  } else {
    card1Path = getCardImage("");
    card2Path = getCardImage("");
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
