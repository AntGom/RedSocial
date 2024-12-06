import User from "../../models/userModel.js";
import fs from "fs";

const upload = async (req, res) => {
    try {
      // Recoger fichero de imagen y comprobar que existe
      if (!req.file) {
        return res.status(404).json({
          status: "error",
          message: "No se ha incluido ninguna imagen para la actualización",
        });
      }
  
      // Conseguir el nombre del archivo y su extensión
      const fileName = req.file.originalname;
      const fileExtension = fileName.split(".").pop().toLowerCase();
  
      // Comprobar la extensión del archivo
      const validExtensions = new Set(["png", "jpg", "jpeg", "gif","webp"]);
      if (!validExtensions.has(fileExtension)) {
        fs.unlinkSync(req.file.path); // Si extensión no es válida, borrar el archivo
        return res.status(400).json({
          status: "error",
          message: "La extensión del archivo no es válida.",
        });
      }
  
      // Si la extensión es correcta, guardar la imagen en bbdd
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { image: fileName },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        });
      }
  
      // Devolver respuesta
      return res.status(200).json({
        status: "success",
        message: "Imagen subida correctamente",
        user: user,
        file: req.file,
      });
    } catch (error) {
      console.error("Error en la subida de imagen:", error);
      return res.status(500).json({
        status: "error",
        message: "Error al procesar la subida de imagen",
      });
    }
  };

  export default upload;