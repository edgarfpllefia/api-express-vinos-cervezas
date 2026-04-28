// Script de seed — genera vinos y cervezas con imágenes descargadas
// Uso: node seed.js
// Borra los documentos existentes antes de insertar

import mongoose from "mongoose";
import "dotenv/config";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";
import Vino from "./model/modelVinos.js";
import Cerveza from "./model/modelCervezas.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Crear carpeta uploads si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("📁 Carpeta uploads creada");
}

// Descarga una imagen desde una URL y la guarda en uploads/
function descargarImagen(url, nombreArchivo) {
  return new Promise((resolve, reject) => {
    const destino = path.join(UPLOADS_DIR, nombreArchivo);
    const archivo = fs.createWriteStream(destino);
    const protocolo = url.startsWith("https") ? https : http;

    const request = protocolo.get(url, (response) => {
      // Seguir redirecciones
      if (response.statusCode === 301 || response.statusCode === 302) {
        archivo.close();
        fs.unlinkSync(destino);
        return descargarImagen(response.headers.location, nombreArchivo)
          .then(resolve)
          .catch(reject);
      }
      if (response.statusCode !== 200) {
        archivo.close();
        fs.unlinkSync(destino);
        return reject(new Error(`Error descargando ${url}: ${response.statusCode}`));
      }
      response.pipe(archivo);
      archivo.on("finish", () => {
        archivo.close();
        resolve(`uploads/${nombreArchivo}`);
      });
    });

    request.on("error", (err) => {
      fs.unlink(destino, () => {});
      reject(err);
    });

    archivo.on("error", (err) => {
      fs.unlink(destino, () => {});
      reject(err);
    });
  });
}

// ─── DATOS ────────────────────────────────────────────────────────────────────

const vinosData = [
  {
    nom: "Rioja Reserva",
    graduacio: 13.5,
    tipus: "Tinto",
    descripcio: "Vino tinto con crianza en barrica de roble americano. Aromas a vainilla, frutos rojos maduros y especias. Elegante y persistente en boca.",
    preu: 18.50,
    imagenUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
    imagenNombre: "seed_vino_rioja.jpg",
  },
  {
    nom: "Albariño Rías Baixas",
    graduacio: 12.5,
    tipus: "Blanco",
    descripcio: "Fresco y afrutado con notas cítricas y florales. Ideal para marisco y pescados. DO Rías Baixas, Galicia.",
    preu: 14.90,
    imagenUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    imagenNombre: "seed_vino_albarino.jpg",
  },
  {
    nom: "Cava Brut Nature",
    graduacio: 11.5,
    tipus: "Espumoso",
    descripcio: "Elaborado con uvas Macabeo, Xarel·lo y Parellada. Burbujas finas y persistentes, con un toque mineral y cítrico.",
    preu: 12.00,
    imagenUrl: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&q=80",
    imagenNombre: "seed_vino_cava.jpg",
  },
  {
    nom: "Priorat Negre",
    graduacio: 15.0,
    tipus: "Tinto",
    descripcio: "Potente y complejo, con aromas minerales propios del llicorella. Frutos negros, regaliz y toques tostados. DO Priorat.",
    preu: 28.00,
    imagenUrl: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80",
    imagenNombre: "seed_vino_priorat.jpg",
  },
  {
    nom: "Verdejo Rueda",
    graduacio: 13.0,
    tipus: "Blanco",
    descripcio: "Herbáceo y fresco con marcada acidez. Notas de hierba fresca, hinojo y cítricos. Perfecto como aperitivo.",
    preu: 11.50,
    imagenUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80",
    imagenNombre: "seed_vino_verdejo.jpg",
  },
  {
    nom: "Rosado Navarra",
    graduacio: 12.0,
    tipus: "Rosado",
    descripcio: "Color frambuesa brillante. Aroma a fresas frescas y pétalos de rosa. Ligero y refrescante, ideal para el verano.",
    preu: 9.90,
    imagenUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80",
    imagenNombre: "seed_vino_rosado.jpg",
  },
];

const cervezasData = [
  {
    nom: "Estrella Damm",
    graduacio: 5.4,
    tipus: "Lager",
    descripcio: "La cerveza mediterránea por excelencia. Elaborada con malta de cebada, arroz y lúpulo Saaz. Fresca y equilibrada.",
    preu: 2.20,
    imagenUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=80",
    imagenNombre: "seed_cerveza_estrella.jpg",
  },
  {
    nom: "Voll-Damm",
    graduacio: 7.2,
    tipus: "Märzen",
    descripcio: "Doble malta con cuerpo y carácter. Aromas a caramelo y frutos secos, con un amargor equilibrado y final largo.",
    preu: 2.80,
    imagenUrl: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&q=80",
    imagenNombre: "seed_cerveza_volldamm.jpg",
  },
  {
    nom: "Moritz Barcelona",
    graduacio: 5.4,
    tipus: "Lager",
    descripcio: "Receta histórica de Barcelona desde 1856. Malta de cebada y levadura propia. Sabor redondo con notas de galleta y lúpulo floral.",
    preu: 2.50,
    imagenUrl: "https://images.unsplash.com/photo-1518176258769-f227c798150e?w=600&q=80",
    imagenNombre: "seed_cerveza_moritz.jpg",
  },
  {
    nom: "Vella Cerdanya IPA",
    graduacio: 6.5,
    tipus: "IPA",
    descripcio: "IPA artesanal del Pirineo catalán. Intenso aroma a lúpulo tropical, con notas de mango, maracuyá y un amargor refrescante.",
    preu: 3.90,
    imagenUrl: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&q=80",
    imagenNombre: "seed_cerveza_ipa.jpg",
  },
  {
    nom: "Rosita Stout",
    graduacio: 4.8,
    tipus: "Stout",
    descripcio: "Stout artesanal oscura con aromas a café, cacao y regaliz. Cuerpo cremoso y final suave. Producida en microbrewery barcelonesa.",
    preu: 4.20,
    imagenUrl: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=600&q=80",
    imagenNombre: "seed_cerveza_stout.jpg",
  },
  {
    nom: "Ambar Especial",
    graduacio: 5.2,
    tipus: "Lager",
    descripcio: "Clásica cerveza aragonesa de color dorado. Sabor suave y equilibrado con notas de malta tostada. Tradición desde 1900.",
    preu: 2.10,
    imagenUrl: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=600&q=80",
    imagenNombre: "seed_cerveza_ambar.jpg",
  },
];

// ─── SEED ─────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB\n");

    // Borrar datos existentes
    await Vino.deleteMany({});
    await Cerveza.deleteMany({});
    console.log("🗑️  Colecciones vaciadas\n");

    // ── Vinos ──
    console.log("🍷 Insertando vinos...");
    for (const datos of vinosData) {
      process.stdout.write(`   ${datos.nom}... `);
      let imatge;
      try {
        imatge = await descargarImagen(datos.imagenUrl, datos.imagenNombre);
        process.stdout.write("imagen OK → ");
      } catch {
        // Si falla la descarga usamos un placeholder
        imatge = "uploads/placeholder.jpg";
        process.stdout.write("imagen FALLIDA (placeholder) → ");
      }
      await Vino.create({
        nom: datos.nom,
        graduacio: datos.graduacio,
        tipus: datos.tipus,
        descripcio: datos.descripcio,
        preu: datos.preu,
        imatge,
      });
      console.log("guardado ✓");
    }

    // ── Cervezas ──
    console.log("\n🍺 Insertando cervezas...");
    for (const datos of cervezasData) {
      process.stdout.write(`   ${datos.nom}... `);
      let imatge;
      try {
        imatge = await descargarImagen(datos.imagenUrl, datos.imagenNombre);
        process.stdout.write("imagen OK → ");
      } catch {
        imatge = "uploads/placeholder.jpg";
        process.stdout.write("imagen FALLIDA (placeholder) → ");
      }
      await Cerveza.create({
        nom: datos.nom,
        graduacio: datos.graduacio,
        tipus: datos.tipus,
        descripcio: datos.descripcio,
        preu: datos.preu,
        imatge,
      });
      console.log("guardado ✓");
    }

    console.log("\n✅ Seed completado:");
    console.log(`   🍷 ${vinosData.length} vinos insertados`);
    console.log(`   🍺 ${cervezasData.length} cervezas insertadas`);

  } catch (err) {
    console.error("\n❌ Error en el seed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Desconectado de MongoDB");
    process.exit(0);
  }
}

seed();
