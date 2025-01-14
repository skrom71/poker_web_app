import express, { Request, Response } from "express";

const apiRouter = express.Router();

// Обработка HTTP-запросов
apiRouter.get("/", (req: Request, res: Response) => {
  res.send("Привет! Это HTTP-запрос.");
});

apiRouter.get("/api", (req: Request, res: Response) => {
  res.send("!API не добавлен");
});

export default apiRouter;
