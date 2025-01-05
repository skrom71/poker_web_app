import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./PokerTable.css";

// server IP 18.221.228.104
const SOCKET_SERVER_URL = "http://localhost:3000"; // Замените на ваш Public IPv4 address
const socket = io(SOCKET_SERVER_URL);

const avatars = [
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/27.jpg",
  "https://randomuser.me/api/portraits/men/68.jpg",
  "https://randomuser.me/api/portraits/women/55.jpg",
];

const emptyIconPlaceholder =
  "https://foni.papik.pro/uploads/posts/2024-10/foni-papik-pro-jqpj-p-kartinki-serii-kvadrat-na-prozrachnom-fone-19.png";

const PokerTable = () => {
  // Создаем подключение к серверу

  const [tableState, setTableState] = useState([null, null, null, null]);
  const [userId, setUserId] = useState(socket.id); // Идентификатор текущего пользователя

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id); // "G5p5..."
      setUserId(socket.id);
    });

    console.log("useEffect userId", userId);
    // Обновление состояния стола при получении данных с сервера

    socket.on("tableState", (newTableState) => {
      setTableState(newTableState);
    });

    // Обработка ошибок
    socket.on("error", (errorMessage) => {
      alert(errorMessage);
    });

    return () => {
      socket.off("tableState");
      socket.off("error");
    };
  }, []);

  const handleSitDown = (seatIndex) => {
    socket.emit("sitDown", { userId, seatIndex });
  };

  const handleLeave = (seatIndex) => {
    socket.emit("leave", { userId, seatIndex });
  };

  const isTableFull = tableState.every((seat) => seat !== null);

  return (
    <div className="poker-table">
      {tableState.map((seat, index) => (
        <div key={index} className={`player player-${index + 1}`}>
          {seat ? (
            seat === userId ? (
              <img src={avatars[index]} alt="Your Avatar" className="avatar" />
            ) : (
              <img
                src={avatars[index]}
                alt="Other Player Avatar"
                className="avatar"
              />
            )
          ) : (
            <img src={emptyIconPlaceholder} alt="non" className="avatar" />
          )}
          <div className="player-name">Player {index + 1}</div>
          {seat === userId && (
            <button
              className="action-button leave-button"
              onClick={() => handleLeave(index)}
            >
              Leave
            </button>
          )}
          {!seat && (
            <button
              className="action-button sit-button"
              onClick={() => handleSitDown(index)}
            >
              Sit Down
            </button>
          )}
        </div>
      ))}

      {isTableFull && !tableState.includes(userId) && (
        <div className="table-message">All seats are occupied!</div>
      )}
    </div>
  );
};

export default PokerTable;
