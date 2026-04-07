import Usuario from "../model/modelUsuario.js";

export async function getUsuarios(req, res) {
  try {
    const datos = await Usuario.find();
    res.json({ datos, total: datos.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUsuarioById(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado", id: req.params.id });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateUsuario(req, res) {
  try {
    const actualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!actualizado) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado", id: req.params.id });
    }
    res.json(actualitzado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}




export async function deleteUsuario(req, res) {
  try {
    const eliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado", id: req.params.id });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
