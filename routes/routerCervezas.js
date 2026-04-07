import express from "express";
import { protegir, autoritzar } from "../middlewares/authMiddleware.js";
import {
  getAllCervezas,
  getIdCerveza,
  postCervezas,
  updateCerveza,
  deleteCerveza,
} from "../controller/ControllerCervezas.js";
import upload from "../config/multer.js";
import { updateCervezaWithImage } from "../controller/ControllerCervezas.js";

const router = express.Router();

//Rutas publicas
router.get("/", getAllCervezas);
router.get("/:id", getIdCerveza);

//Con middelware protegir y autorizar
router.use(protegir);
router.post(
  "/",
  autoritzar("admin", "editor"),
  upload.single("imatge"),
  postCervezas,
);
router.put("/:id", autoritzar("admin", "editor"), updateCerveza);
router.delete("/:id", autoritzar("admin", "editor"), deleteCerveza);
router.patch(
  "/:id/imatge",
  autoritzar("admin", "editor"),
  upload.single("imatge"),
  updateCervezaWithImage,
);

export default router;
