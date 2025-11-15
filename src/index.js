import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { testConnection } from "./db.js";
import usersRouter from "./routes/users-routes.js";
import productsRouter from "./routes/products-routes.js";
import authRouter from "./routes/auth-routes.js";

dotenv.config();

// FIX __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// 🔥 SERVE FOLDER PUBLIC
app.use(express.static(path.join(__dirname, "public")));

// API ROUTES
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/auth", authRouter);

// 🔥 DEFAULT KE LOGIN.HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

// START SERVER
app.listen(port, async () => {
    console.log(`server running on http://localhost:${port}`);
    await testConnection();
});
