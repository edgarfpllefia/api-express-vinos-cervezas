import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
    },
    email: {
      type: String,
      required: [true, "L'email és obligatori"],
      unique: true, // índex únic; no es poden repetir emails
      trim: true,
      lowercase: true, // normalitzar a minúscules
    },
    password: {
      type: String,
      required: [true, "La contrasenya és obligatòria"],
      minlength: 6,
      select: false, // no incloure password en find() per defecte (seguretat)
    },
    foto: {
      type: String,
      required: [true, "La imagen es obligatoria"],
      trim: true,
    },
    rol: {
      type: String,
      enum: ["usuari", "editor", "admin"],
      default: "usuari",
    },
  },
  { timestamps: true },
);

// Middleware pre('save'): s'executa abans de guardar el document
// Només hashejem si la contrasenya s'ha modificat (evitar re-hashejar en updates d'altres camps)
usuarioSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10); // 10 = cost del salt
});

// Mètode d'instància: compara la contrasenya en clar amb el hash guardat (per al login)
usuarioSchema.methods.comprovarPassword = function (candidat) {
  return bcrypt.compare(candidat, this.password);
};

export default mongoose.model("Usuario", usuarioSchema);
