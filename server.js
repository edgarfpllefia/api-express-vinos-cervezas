import express from "express";
import routerCervezas from "./routes/routerCervezas.js";
import routerVinos from "./routes/routerVinos.js";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import routerPedidos from "./routes/routerPedidos.js";
import routerUsuarios from "./routes/routerUsuarios.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`<h1>Bienvenido a la API de pruebas</h1>`);
});

app.get("/api", (req, res) => {
  res.json({ mensaje: "Bienvenido a API" });
});

app.use("/api/cervezas", routerCervezas);
app.use("/api/vinos", routerVinos);
app.use("/api/auth", authRoutes);
app.use("/api/pedidos", routerPedidos);
app.use("/api/usuarios", routerUsuarios);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor a http://localhost:${PORT}`);
  });
});
