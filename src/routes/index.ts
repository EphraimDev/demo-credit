import express from "express";
import { TransactionRoutes, UserRoutes, WalletRoutes } from "../modules";

const app = express();

app.use("/users", UserRoutes);
app.use("/transactions", TransactionRoutes);
app.use("/wallets", WalletRoutes);

export default app;
