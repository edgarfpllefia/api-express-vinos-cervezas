// Importar Express per crear el router de rutes
import express from "express";
// Importar jsonwebtoken per generar i (més endavant) verificar el JWT
import jwt from "jsonwebtoken";
// Importar el model Usuario per consultar i crear usuaris a la BD
import Usuario from "../model/modelUsuario.js";
// Importar el middleware de protecció per a la ruta de perfil
import { protegir } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

// Crear un router d'Express; les rutes es muntaran sota /api/auth
const router = express.Router();

// POST /api/auth/registro — crear compte nou; el pre('save') del model hasheja la contrasenya
router.post("/registro", upload.single("foto"), async (req, res) => {
  try {
    // Extreure email i contrasenya del cos de la petició (req.body)
    const { name, email, password } = req.body;
    const foto = req.file ? req.file.path : null;
    // Validar que s'han enviat tots dos camps; si no, 400 Bad Request
    if (!name || !email || !password || !foto) {
      return res
        .status(400)
        .json({ error: "No están todos los campos completos" });
    }
    // Comprovar si ja existeix un usuari amb aquest email a la BD
    const existent = await Usuario.findOne({ email });
    // Si existeix, no es pot registrar de nou; retornar 400
    if (existent) {
      return res.status(400).json({ error: "Aquest email ja està registrat" });
    }
    // Crear el nou usuari; el middleware pre('save') hasheja la contrasenya abans de guardar
    const usuari = await Usuario.create({ name, email, password, foto });
    // Generar el JWT: payload amb l'id de l'usuari, signat amb JWT_SECRET, vàlid 7 dies
    const token = jwt.sign(
      { id: usuari._id }, // payload: dades que viatjaran dins del token
      process.env.JWT_SECRET, // clau secreta per signar (només el servidor la coneix)
      { expiresIn: "7d" }, // el token caduca en 7 dies
    );
    // Retornar 201 Created amb el token i les dades públiques de l'usuari (sense password)
    res.status(201).json({
      token,
      usuari: { id: usuari._id, email: usuari.email, rol: usuari.rol },
    });
  } catch (err) {
    // Qualsevol error (p. ex. validació de Mongoose) es respon amb 400
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login — validar email i contrasenya i retornar un JWT
router.post("/login", async (req, res) => {
  try {
    // Extreure credencials del cos de la petició
    const { email, password } = req.body;
    // Buscar l'usuari per email; select('+password') inclou el camp password (per defecte select: false al model)
    const usuari = await Usuario.findOne({ email }).select("+password");
    // Si no hi ha usuari o la contrasenya no coincideix amb el hash, 401 Unauthorized
    if (!usuari || !(await usuari.comprovarPassword(password))) {
      return res.status(401).json({ error: "Credencials incorrectes" });
    }
    // Generar el JWT amb l'id de l'usuari, signat i amb caducitat de 7 dies
    const token = jwt.sign({ id: usuari._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Retornar el token i les dades de l'usuari (sense password) en format JSON
    res.json({
      token,
      usuari: {
        name: usuari.name,
        id: usuari._id,
        email: usuari.email,
        rol: usuari.rol,
        foto: usuari.foto,
      },
    });
  } catch (err) {
    // Errors inesperats (BD, etc.) es responen amb 500
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/perfil — actualitzar dades de l'usuari autenticat (requereix token)
// protegir: middleware que verifica el JWT i posa l'usuari a req.usuari
router.put("/perfil", protegir, async (req, res) => {
  try {
    const usuari = req.usuari; // usuari carregat pel middleware
    const { email, password } = req.body;

    // Si s'envia email, comprovar que no estigui en ús per un altre usuari
    if (email && email !== usuari.email) {
      const existent = await Usuario.findOne({ email });
      if (existent) {
        return res
          .status(400)
          .json({ error: "Aquest email ja està registrat" });
      }
      usuari.email = email;
    }
    // Si s'envia password, s'assigna; el pre('save') la hashejarà en fer save()
    if (password) {
      usuari.password = password;
    }

    await usuari.save(); // dispara pre('save') si s'ha modificat password

    // Retornar l'usuari actualitzat (sense password); opcionalment un nou token
    const token = jwt.sign({ id: usuari._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      usuari: { id: usuari._id, email: usuari.email, rol: usuari.rol },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Exportar el router per poder muntar-lo a l'app (p. ex. app.use('/api/auth', router))
export default router;
