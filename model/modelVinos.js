import mongoose from "mongoose";

const vinoSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "El nom és obligatori"], // [valor, missatge d'error]
      trim: true, // elimina espais en blanc al principi i al final
    },
    graduacio: {
      type: Number,
      required: true,
      min: [0, "La graduació ha de ser positiva"],
      max: 20,
    },
    tipus: {
      type: String,
      trim: true,
      default: "Lager", // si no s'envia, es guarda 'Lager'
    },
    descripcio: {
      type: String,
      trim: true,
    },
    imatge: {
      type: String,
      required: [true, "La imagen es obligatoria"],
      trim: true,
    },
    preu: {
      type: Number,
      required: [true, "El preu és obligatori"],
      min: [0, "El preu ha de ser positiu"],
    },
  },
  {
    timestamps: true, // afegeix automàticament createdAt i updatedAt
  },
);

export default mongoose.model("Vino", vinoSchema);
