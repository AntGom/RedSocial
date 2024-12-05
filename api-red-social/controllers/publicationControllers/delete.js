import Publication from "../../models/publicationModel.js";

const remove = async (req, res) => {
  try {
    //Busca publicación con el ID
    const publication = await Publication.findById(req.params.id);
    console.log("Publicación encontrada:", publication);
    console.log("Usuario autenticado (req.user):", req.user);

    //Publicación existe?
    if (!publication) {
      return res.status(404).json({
        status: "error",
        message: "La publicación no existe",
      });
    }

    //Verificar usuario es owner/admin
    if (
      publication.user?.toString() === req.user.id.toString() ||
      req.user.role === "admin"
    ) {
      // Eliminar la publicación
      await publication.deleteOne();

      return res.status(200).json({
        status: "success",
        message: "Publicación eliminada correctamente",
        publication: req.params.id,
      });
    } else {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para eliminar esta publicación",
      });
    }
  } catch (error) {
    console.log("Error al eliminar la publicación:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar la publicación",
      error: error.message,
    });
  }
};

export default remove;
