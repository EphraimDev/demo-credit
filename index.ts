import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import http from "http";
import rTracer from "cls-rtracer";
import handleGracefulShutdown from "./src/utils/handleGracefulShutdown";
import dbConn from "./src/database/connect";
import appRoutes from "./src/routes";
import { ProcessTransactions } from "./src/jobs";
import { handleLDAPInjection, handleSqlInjection } from "./src/middlewares";

dotenv.config();

ProcessTransactions();

const app: Express = express();
const server = http.createServer(app);

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// check for sql and ldap injections
app.use(handleSqlInjection);
app.use(handleLDAPInjection);

if (process.env.NODE_ENV === "development")
  app.use("/logs", express.static(path.join(__dirname, "../logs")));

app.use(rTracer.expressMiddleware());

app.get("/", (_req: Request, res: Response) => {
  res.send("Demo Credit Server");
});

app.use("/api/v1", appRoutes);

app.use("*", (_req: Request, res: Response) => {
  res.status(404).send("This route does not exist");
});

server.listen(port, async () => {
  try {
    await dbConn.raw("SELECT now()");
    console.log(`⚡️[database]: Database is connected`);
    console.log(`⚡️[server]: Server is running at port ${port}`);
  } catch (error) {
    console.log(error);
  }
});

const sigs = ["SIGINT", "SIGTERM", "SIGQUIT"];
sigs.forEach((sig) => {
  process.on(sig, () => handleGracefulShutdown(server));
});

export { server, dbConn };
