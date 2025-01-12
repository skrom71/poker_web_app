import { useState, useEffect } from "react";
import "./PlayerStatusBar.css";
import BackCardIcon from "/src/assets/images/card-back.png";

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

const link = getRandomCardImage();

function PlayerStatusBar({ isCurrent }) {
  function renderTag() {
    let card1Path;
    let card2Path;
    if (isCurrent) {
      card1Path = getRandomCardImage();
      card2Path = getRandomCardImage();
    } else {
      card1Path = BackCardIcon;
      card2Path = BackCardIcon;
    }
    return (
      <div className="main-container-status-bar">
        <img src={card1Path} className="player-status-bar-card1"></img>
        <img src={card2Path} className="player-status-bar-card2"></img>
        <div className="player-status-bar-footer">
          <div className="player-status-bar-name">Player</div>
          <div className="player-status-bar-balance">9543.3</div>
        </div>
      </div>
    );
  }

  return renderTag(isCurrent);
}

export default PlayerStatusBar;
