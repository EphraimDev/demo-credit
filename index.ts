import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import http from "http";
import rTracer from "cls-rtracer";
import handleGracefulShutdown from "./src/utils/handleGracefulShutdown";
import initializeDB from "./src/database/connect";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

if (process.env.NODE_ENV === "development")
  app.use("/logs", express.static(path.join(__dirname, "../logs")));

app.use(rTracer.expressMiddleware());

app.get("/", (_req: Request, res: Response) => {
  res.send("Demo Credit Server");
});

app.use("*", (_req: Request, res: Response) => {
  res.status(404).send("This route does not exist");
});

const db = initializeDB();

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at port ${port}`);
});

const sigs = ["SIGINT", "SIGTERM", "SIGQUIT"];
sigs.forEach((sig) => {
  process.on(sig, () => handleGracefulShutdown(server));
});

export { server, db };
