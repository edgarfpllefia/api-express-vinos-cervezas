import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  vinos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Vino" },
      cantidad: { type: Number, default: 1 },
    },
  ],
  cervezas: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Cerveza" },
      cantidad: { type: Number, default: 1 },
    },
  ],
});

export default mongoose.model("Pedido", pedidoSchema);
