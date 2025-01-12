import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HoldemRoom from "./pages/holdem/HoldemRoom.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HoldemRoom />
  </StrictMode>
);
