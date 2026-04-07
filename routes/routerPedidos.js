import express from "express";
import Pedido from "../model/modelPedidos.js";
import { protegir } from "../middlewares/authMiddleware.js";
import { postPedido } from "../controller/ControllerPedidos.js";

const router = express.Router();

router.post("/", protegir, postPedido);

export default router;
