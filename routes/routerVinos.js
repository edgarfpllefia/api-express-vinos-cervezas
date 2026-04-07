import express from "express";
import { protegir, autoritzar } from "../middlewares/authMiddleware.js";
import {
  getVinosAll,
  getVinosById,
  postVinos,
  updateVino,
  deleteVino,
} from "../controller/ControllerVino.js";
import upload from "../config/multer.js";
import { updateVinoWithImage } from "../controller/ControllerVino.js";

const router = express.Router();

//Rutas públicas
router.get("/", getVinosAll);
router.get("/:id", getVinosById);

//Rutas protegidas por el middleware protegir y autoritzar
router.use(protegir);
router.post(
  "/",
  autoritzar("admin", "editor"),
  upload.single("imatge"),
  postVinos,
);
router.put("/:id", autoritzar("admin", "editor"), updateVino);
router.delete("/:id", autoritzar("admin", "editor"), deleteVino);
router.patch(
  "/:id/imatge",
  autoritzar("admin", "editor"),
  upload.single("imatge"),
  updateVinoWithImage,
);

export default router;
