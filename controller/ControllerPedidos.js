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

    // Populate para tener nombres y precios en el email
    const pedidoPopulado = await Pedido.findById(nuevoPedido._id)
      .populate("vinos.producto", "nom preu")
      .populate("cervezas.producto", "nom preu");

    // Construir líneas del pedido
    const lineasVinos = pedidoPopulado.vinos.map((v) => {
      const precio = v.producto.preu != null
        ? `${(v.producto.preu * v.cantidad).toFixed(2)} €`
        : "";
      return `  - ${v.producto.nom} × ${v.cantidad}${precio ? "  (${precio})" : ""}`;
    });

    const lineasCervezas = pedidoPopulado.cervezas.map((c) => {
      const precio = c.producto.preu != null
        ? `${(c.producto.preu * c.cantidad).toFixed(2)} €`
        : "";
      return `  - ${c.producto.nom} × ${c.cantidad}${precio ? "  (${precio})" : ""}`;
    });

    const totalEuros = [
      ...pedidoPopulado.vinos.map((v) => (v.producto.preu ?? 0) * v.cantidad),
      ...pedidoPopulado.cervezas.map((c) => (c.producto.preu ?? 0) * c.cantidad),
    ].reduce((acc, val) => acc + val, 0);

    const tienePrecios = [
      ...pedidoPopulado.vinos,
      ...pedidoPopulado.cervezas,
    ].every((i) => i.producto.preu != null);

    const resumenProductos = [
      ...(lineasVinos.length ? ["Vinos:", ...lineasVinos] : []),
      ...(lineasCervezas.length ? ["Cervezas:", ...lineasCervezas] : []),
    ].join("\n");

    const totalLinea = tienePrecios
      ? `\nTOTAL: ${totalEuros.toFixed(2)} €`
      : "";

    // ── Email al usuario ──
    await transporter.sendMail({
      from: `"Vinoteca" <${process.env.EMAIL_USER}>`,
      to: usuari.email,
      subject: "Confirmación de tu pedido — Vinoteca",
      text: `Hola ${usuari.name},

Hemos recibido tu pedido correctamente. Aquí tienes el resumen:

${resumenProductos}
${totalLinea}

ID del pedido: ${nuevoPedido._id}

En breve nos pondremos en contacto contigo para coordinar la entrega.

Gracias por confiar en Vinoteca.
— El equipo de Vinoteca`,
    });

    // ── Email al propietario ──
    await transporter.sendMail({
      from: `"Vinoteca" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_PROPIETARIO,
      subject: `Nuevo pedido de ${usuari.name}`,
      text: `Nuevo pedido recibido.

Cliente: ${usuari.name} (${usuari.email})
ID del pedido: ${nuevoPedido._id}

${resumenProductos}
${totalLinea}`,
    });

    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
