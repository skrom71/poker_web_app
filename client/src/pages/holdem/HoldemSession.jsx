import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./HoldemSession.css";
import PlayerStatusBar from "../../components/PlayerStatusBar.jsx";
import JoinButton from "../../components/buttons/PokerTableJoinButton.jsx";
import ChipIcon from "/src/assets/images/chip-1.png";

// Функция для получения случайного изображения
function getRandomCardImage() {
  // Генерируем случайное число от 1 до 52

  const rangs = [
    "A",
    "K",
    "Q",
    "J",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];
  const suits = ["D", "H", "S", "C"];
  const randomRandIndex = Math.floor(Math.random() * rangs.length);
  const randomSuitIndex = Math.floor(Math.random() * suits.length);

  // Формируем имя файла
  const imageName = `${rangs[randomRandIndex]}${suits[randomSuitIndex]}.png`;
  console.log("Случайный элемент:", imageName);
  // Путь к изображению (можно указать папку, если изображения там хранятся)
  const imagePath = `/src/assets/images/${imageName}`;

  return imagePath;
}

function HoldemSession() {
  return (
    <div className="main-container-session">
      <div className="player player-top-1">
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
      {/* <div className="player player-left-2">
        <JoinButton />
      </div> */}
      <div className="player player-left-3">
        <PlayerStatusBar isCurrent={false} />
      </div>
      <div className="player player-right-1">
        <PlayerStatusBar isCurrent={false} />
      </div>
      {/* <div className="player player-right-2">
        <JoinButton />
      </div> */}
      <div className="player player-right-3">
        <PlayerStatusBar isCurrent={false} />
      </div>
      <div className="player player-bottom-1">
        <PlayerStatusBar isCurrent={false} />
      </div>
      {/* <div className="player player-bottom-2">
        <JoinButton />
      </div> */}

      <div className="pot">
        <img src={ChipIcon} className="pot-icon" />
        234.3
      </div>

      <div className="blinde">Min.Max: 10/20</div>

      <div className="commun-card-container">
        <img src={getRandomCardImage()} className="commun-card"></img>
        <img src={getRandomCardImage()} className="commun-card"></img>
        <img src={getRandomCardImage()} className="commun-card"></img>
        <img src={getRandomCardImage()} className="commun-card"></img>
        <img src={getRandomCardImage()} className="commun-card"></img>
      </div>
    </div>
  );
}

export default HoldemSession;
