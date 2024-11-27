import Publication from "../../models/publicationModel.js";
import fs from 'fs';

const upload = async (req, res) => {
    try {
        // Sacar publication id
        const publicationId = req.params.id;

        // Comprobar si hay un archivo cargado
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No se ha incluido ninguna imagen",
            });
        }

        // Conseguir el nombre con el que se ha guardado el archivo en el servidor
        const savedFileName = req.file.filename;  // Nombre correcto del archivo guardado
        const fileExtension = savedFileName.split(".").pop().toLowerCase();

        // Comprobar la extensión del archivo
        const validExtensions = new Set(["png", "jpg", "jpeg", "gif", "webp"]);
        if (!validExtensions.has(fileExtension)) {
            await fs.promises.unlink(req.file.path); // Elimina el archivo si la extensión no es válida
            return res.status(400).json({
                status: "error",
                message: "La extensión del archivo no es válida.",
            });
        }

        // Guardar el nombre de archivo en la base de datos
        const publication = await Publication.findOneAndUpdate(
            { "user": req.user.id, "_id": publicationId },
            { file: savedFileName },  // Guardar el nombre correcto del archivo
            { new: true }
        )
        .populate("user", "name")
        .select("createdAt user");

        if (!publication) {
            return res.status(404).json({
                status: "error",
                message: "Publicación no encontrada",
            });
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Imagen subida correctamente",
            publication: {
                createdAt: publication.createdAt,
                user: publication.user.name,
                id: publication._id,
                file: savedFileName // Devuelve el nombre del archivo guardado
            }
        });

    } catch (error) {
        console.error("Error en la subida de imagen:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al procesar la subida de imagen",
            error: error.message,
        });
    }
};

export default upload;
