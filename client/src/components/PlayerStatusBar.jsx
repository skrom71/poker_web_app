import { useState, useEffect } from "react";
import "./PlayerStatusBar.css";

// Функция для получения случайного изображения
function getRandomCardImage() {
  // Генерируем случайное число от 1 до 52
  const randomNumber = Math.floor(Math.random() * 52) + 1;

  // Формируем имя файла
  const imageName = `card-${randomNumber}.png`;

  // Путь к изображению (можно указать папку, если изображения там хранятся)
  const imagePath = `/src/assets/images/${imageName}`;

  return imagePath;
}

const link = getRandomCardImage();

function PlayerStatusBar() {
  return (
    <div className="main-container-status-bar">
      <img src={getRandomCardImage()} className="player-status-bar-card1"></img>
      <img src={getRandomCardImage()} className="player-status-bar-card2"></img>
      <div className="player-status-bar-footer">
        <div className="player-status-bar-name">Player</div>
        <div className="player-status-bar-balance">9543.3</div>
      </div>
    </div>
  );
}

export default PlayerStatusBar;
