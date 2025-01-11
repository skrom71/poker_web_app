import React, { useState, useEffect } from "react";
import "./HoldemRoom.css";
import pokerTableImage from "/src/assets/images/poker-table.png";
import Session from "./HoldemSession.jsx";
import PokerTableToolBar from "../../components/PokerTableToolBar.jsx";

function HoldemRoom() {
  return (
    <div className="main-container">
      <div className="poker-table">
        <img src={pokerTableImage} className="background-image"></img>

        <Session />
      </div>
      <PokerTableToolBar />
    </div>
  );
}

export default HoldemRoom;
