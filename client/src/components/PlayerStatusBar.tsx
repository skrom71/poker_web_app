import { useState, useEffect } from "react";
import "./PlayerStatusBar.css";
import BackCardIcon from "/src/assets/images/card-back.png";

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
    card1Path = Card(cards[0]);
    card2Path = Card(cards[1]);
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
