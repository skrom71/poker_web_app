import React from "react";
import suit_d from "/src/assets/images/suit_d.png";
import suit_h from "/src/assets/images/suit_h.png";
import suit_s from "/src/assets/images/suit_s.png";
import suit_c from "/src/assets/images/suit_c.png";
import BackCardIcon from "/src/assets/images/card-back.png";

interface CardProps {
  rank?: string;
  suit?: string;
  isBackCard?: boolean;
}

const Card: React.FC<CardProps> = ({
  rank = "",
  suit = "",
  isBackCard = false,
}) => {
  if (Boolean(isBackCard)) {
    return (
      <div className="card-container">
        <img src={BackCardIcon} className="card-back" />
      </div>
    );
  }

  let suitIcon: string = "";
  let rankColor: string = "";

  switch (suit) {
    case "d":
      suitIcon = suit_d;
      rankColor = "red";
    case "h":
      suitIcon = suit_h;
      rankColor = "red";
    case "s":
      suitIcon = suit_s;
      rankColor = "black";
    case "c":
      suitIcon = suit_c;
      rankColor = "black";
  }

  return (
    <div className="card-container">
      <div className={`card-rank ${rankColor}`}>{rank}</div>
      <img src={suitIcon} className="card-suit" />
    </div>
  );
};

export default Card;
