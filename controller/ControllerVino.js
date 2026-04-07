import Vino from "../model/modelVinos.js";

export async function getVinosAll(req, res) {
  console.log("peticion GET para todos los vinos");
  try {
    const datos = await Vino.find();
    res.json({ datos, total: datos.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getVinosById(req, res) {
  try {
    const vino = await Vino.findById(req.params.id);
    if (!vino) {
      return res
        .status(404)
        .json({ error: "Vino no encontrado", id: req.params.id });
    }
    res.json(vino);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function postVinos(req, res) {
  console.log("Has hecho una petición a api/vinos con el metodo post");
  try {
    const imatge = req.file ? "uploads/" + req.file.filename : null;
    const nuevo = await Vino.create(...req.body, imatge);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message }); // 400 per errors de validació
  }
}

export async function updateVino(req, res) {
  try {
    const actualitzado = await Vino.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!actualitzado) {
      return res
        .status(404)
        .json({ error: "Vino no encontrado", id: req.params.id });
    }
    res.json(actualitzado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteVino(req, res) {
  try {
    const eliminado = await Vino.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res
        .status(404)
        .json({ error: "Vino no encontrado", id: req.params.id });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateVinoWithImage(req, res) {
  try {
    // Si no arriba fitxer (camp incorrecte, filtre rebutjat, etc.), retornem error de client
    if (!req.file) {
      return res.status(400).json({ error: "Cap fitxer pujat" });
    }

    // IMPORTANT: desem només la ruta relativa, no la ruta absoluta del sistema operatiu
    // Amb això el client podrà construir la URL pública: /uploads/<filename>
    const pathImatge = "uploads/" + req.file.filename;

    // Actualitzem només el camp imatge de la cervesa indicada per id
    const actualitzado = await Vino.findByIdAndUpdate(
      req.params.id,
      { imatge: pathImatge },
      { new: true }, // retornar el document amb el camp imatge ja actualitzat
    );
    if (!actualitzado) {
      return res.status(404).json({ error: "Cervesa no trobada" });
    }
    res.json(actualitzado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
