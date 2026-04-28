import Cerveza from "../model/modelCervezas.js";

export async function getAllCervezas(req, res) {
  console.log("Peticion GET para todas las cervezas");
  try {
    const datos = await Cerveza.find();
    res.json({ datos, total: datos.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getIdCerveza(req, res) {
  try {
    const cerveza = await Cerveza.findById(req.params.id);
    if (!cerveza) {
      return res
        .status(404)
        .json({ error: "Cerveza no encontrada", id: req.params.id });
    }
    res.json(cerveza);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function postCervezas(req, res) {
  try {
    const imatge = req.file ? "uploads/" + req.file.filename : null;
    const nova = await Cerveza.create({ ...req.body, imatge });
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: err.message }); // 400 per errors de validació
  }
}

export async function updateCerveza(req, res) {
  console.log("utilizando update cerveza");
  try {
    const actualitzada = await Cerveza.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!actualitzada) {
      return res
        .status(404)
        .json({ error: "Cervesa no trobada", id: req.params.id });
    }
    res.json(actualitzada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteCerveza(req, res) {
  console.log("utilizando delete cerveza");
  try {
    const eliminada = await Cerveza.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      return res
        .status(404)
        .json({ error: "Cervesa no trobada", id: req.params.id });
    }
    res.status(204).send(); // 204 No Content: èxit sense cos
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateCervezaWithImage(req, res) {
  try {
    // Si no arriba fitxer (camp incorrecte, filtre rebutjat, etc.), retornem error de client
    if (!req.file) {
      return res.status(400).json({ error: "Cap fitxer pujat" });
    }

    // IMPORTANT: desem només la ruta relativa, no la ruta absoluta del sistema operatiu
    // Amb això el client podrà construir la URL pública: /uploads/<filename>
    const pathImatge = "uploads/" + req.file.filename;

    // Actualitzem només el camp imatge de la cervesa indicada per id
    const actualitzada = await Cerveza.findByIdAndUpdate(
      req.params.id,
      { imatge: pathImatge },
      { new: true }, // retornar el document amb el camp imatge ja actualitzat
    );
    if (!actualitzada) {
      return res.status(404).json({ error: "Cervesa no trobada" });
    }
    res.json(actualitzada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
