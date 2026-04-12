import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth";
import cookieparser from "cookie-parser";
import boardsRouter from "./routes/boards";
import columnsRouter from "./routes/columns";
import cardRouter from "./routes/card";
import memberRouterr from "./routes/members";
import tagRouter from "./routes/tags";
import commentRouter from "./routes/comments";
import cors from "cors";
import { errorMiddleware } from "./middleware/errorMiddleware";
import http from "http";
import { WebSocketServer } from "ws";
import { setupWsServer } from "./ws/wsServer";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cookieparser());

app.use("/auth", authRouter);
app.use("/boards", boardsRouter);
app.use("/columns", columnsRouter);
app.use("/cards", cardRouter);
app.use("/boards/:boardId/members", memberRouterr);
app.use("/cards/:cardId/comments", commentRouter);
app.use("/tags", tagRouter);

app.use(errorMiddleware);

const server = http.createServer(app);

const wss = new WebSocketServer({ server: server, path: "/ws" });

setupWsServer(wss);

server.listen(PORT, () =>
  console.log(`backend-server started running on ${PORT}`)
);
