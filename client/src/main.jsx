import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HoldemSession from "./pages/holdem/HoldemSession.tsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HoldemSession />
  </StrictMode>
);
