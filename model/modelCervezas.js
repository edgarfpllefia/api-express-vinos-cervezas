import mongoose from "mongoose";

// L'esquema defineix l'estructura i validacions dels documents de la col·lecció
const cervezaSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true, // afegeix automàticament createdAt i updatedAt
  },
);

// El model és el constructor per la col·lecció 'cervezas' (Mongoose pluralitza el nom)
export default mongoose.model("Cerveza", cervezaSchema);
