// Функция для оценки победителя в Texas Hold'em
import { Hand } from "pokersolver"; // Используем библиотеку pokersolver
import { Player } from "./holdem_session";
/**
 * Определяет победителя в покерной сессии Texas Hold'em
 * @param players - Список игроков и их карты на руках
 * @param board - Карты на борде (5 карт)
 * @returns Массив имен победителей (в случае ничьей)
 */
export function determineWinner(players: Player[], board: string[]): string[] {
  if (board.length !== 5) {
    throw new Error("На борде должно быть ровно 5 карт.");
  }

  // Создаем массив рук игроков
  const playerHands = players.map((player) => {
    const allCards = player.cards.concat(board); // Объединяем карты игрока и борда
    return {
      name: player.id,
      hand: Hand.solve(allCards),
    };
  });

  // Определяем победителя (или победителей в случае ничьей)
  const bestHand = Hand.winners(playerHands.map((p) => p.hand));

  // Возвращаем имена победителей
  return playerHands
    .filter((p) => bestHand.includes(p.hand))
    .map((p) => p.name);
}

// // Пример использования
// const players: Player[] = [
//   { name: "Игрок 1", hand: ["Ah", "Kh"] }, // Пара тузов
//   { name: "Игрок 2", hand: ["Qs", "Js"] }, // Пара дам
//   { name: "Игрок 3", hand: ["2d", "3d"] }, // Слабая комбинация
// ];

// const board: string[] = ["10h", "Jd", "Qh", "Ks", "9c"]; // Борд
// const winners = determineWinner(players, board);
// console.log("Победители:", winners);
