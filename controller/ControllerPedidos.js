import Pedido from "../model/modelPedidos.js";
import transporter from "../config/email.js";

export async function postPedido(req, res) {
  try {
    const { vinos, cervezas } = req.body;
    const usuari = req.usuari;

    const nuevoPedido = await Pedido.create({
      vinos,
      cervezas,
      usuario: usuari._id,
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_PROPIETARIO,
      subject: "Nuevo pedido recibido",
      text: `El usuario ${usuari.email} ha hecho un pedido.
  
ID del pedido: ${nuevoPedido._id}
Vinos: ${JSON.stringify(nuevoPedido.vinos)}
Cervezas: ${JSON.stringify(nuevoPedido.cervezas)}`,
    });
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
