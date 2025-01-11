import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./HoldemSession.css";
import PlayerStatusBar from "../../components/PlayerStatusBar.jsx";
import JoinButton from "../../components/buttons/PokerTableJoinButton.jsx";

function HoldemSession() {
  return (
    <div className="main-container-session">
      <div className="player player-top-1">
        <PlayerStatusBar />
      </div>
      <div className="player player-top-2">
        <JoinButton />
      </div>
      <div className="player player-left-1">
        <PlayerStatusBar />
      </div>
      <div className="player player-left-2">
        <JoinButton />
      </div>
      <div className="player player-left-3">
        <PlayerStatusBar />
      </div>
      <div className="player player-right-1">
        <PlayerStatusBar />
      </div>
      <div className="player player-right-2">
        <JoinButton />
      </div>
      <div className="player player-right-3">
        <PlayerStatusBar />
      </div>
      <div className="player player-bottom-1">
        <PlayerStatusBar />
      </div>
      <div className="player player-bottom-2">
        <JoinButton />
      </div>
    </div>
  );
}

export default HoldemSession;
