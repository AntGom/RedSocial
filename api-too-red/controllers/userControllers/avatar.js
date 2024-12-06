import fs from "fs";
import path from "path";

const avatar = async (req, res) => {
  // Sacar el parámetro de la URL
  const file = req.params.file;

  // Montar el path real de la URL
  const filePath =path.join( `./uploads/avatars/${file}`);

  // Comprobar si existe el archivo
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      return res.status(404).json({
        status: "error",
        message: "No existe el archivo",
      });
    }

    // Devolver el archivo
    res.status(200).sendFile(path.resolve(filePath));
  });
};

export default avatar;