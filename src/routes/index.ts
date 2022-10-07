import express from "express";
import { TransactionRoutes, UserRoutes } from "../modules";

const app = express();

app.use("/users", UserRoutes);
app.use("/transactions", TransactionRoutes);

export default app;
