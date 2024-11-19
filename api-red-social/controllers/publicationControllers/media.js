import fs from "fs";
import path from "path";

// Obtenemos la ruta absoluta del directorio actual
const __dirname = path.resolve();

const media = async (req, res) => {
  // Obtener el parámetro de la URL
  const file = req.params.file;

  // Construir la ruta absoluta del archivo
  const filePath = path.join(__dirname, "uploads", "publications", file);

  // Comprobar si existe el archivo
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {  // Verifica si hay error o si el path no es archivo
      return res.status(404).json({
        status: "error",
        message: "No existe el archivo",
      });
    }

    // Devolver el archivo si existe
    return res.status(200).sendFile(filePath);
  });
};

export default media;
