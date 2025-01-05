import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import PokerTable from "./components/PokerTable.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PokerTable />
  </StrictMode>
);
