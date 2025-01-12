import { useState, useEffect } from "react";
import "./PokerTableToolBar.css";

function PokerTableToolBar() {
  return (
    <div className="main-container-toolbar">
      <button className="toolbar-button red">Fold</button>
      <button className="toolbar-button green">Call 42.3</button>
      <button className="toolbar-button green">Bet</button>
      <button className="toolbar-button green">Check</button>
    </div>
  );
}

export default PokerTableToolBar;
