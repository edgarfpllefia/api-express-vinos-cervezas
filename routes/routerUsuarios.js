import express from "express";
import { protegir, autoritzar } from "../middlewares/authMiddleware.js";
import { getUsuarios, getUsuarioById, deleteUsuario, updateUsuario } from "../controller/ControllerUsuarios.js";

const router = express.Router();

// Todas las rutas requieren token
router.use(protegir);

// Solo admin puede ver todos los usuarios o eliminar
router.get("/", autoritzar("admin"), getUsuarios);
router.get("/:id", autoritzar("admin"), getUsuarioById);
router.put("/:id", autoritzar("admin"), updateUsuario);
router.delete("/:id", autoritzar("admin"), deleteUsuario);

export default router;