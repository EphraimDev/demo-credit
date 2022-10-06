import express from "express";
import { UserRoutes } from "../modules";

const app = express();

app.use("/users", UserRoutes);

export default app;
