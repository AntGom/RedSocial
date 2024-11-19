import Publication from "../../models/publicationModel.js";

const deleteComment = async (req, res) => {
  try {
    const { publication_id, comment_id } = req.params;

    // Buscar la publicación
    const publication = await Publication.findById(publication_id);

    if (!publication) {
      return res.status(404).json({ status: "error", message: "Publicación no encontrada." });
    }

    // Buscar el comentario y eliminarlo
    const commentIndex = publication.comments.findIndex(comment => comment._id.toString() === comment_id);

    if (commentIndex === -1) {
      return res.status(404).json({ status: "error", message: "Comentario no encontrado." });
    }

    publication.comments.splice(commentIndex, 1);
    await publication.save();

    return res.status(200).json({ status: "success", message: "Comentario eliminado con éxito." });
  } catch (error) {
    console.error("Error al eliminar el comentario:", error);
    return res.status(500).json({ status: "error", message: "Error al eliminar el comentario." });
  }
};

export default deleteComment;