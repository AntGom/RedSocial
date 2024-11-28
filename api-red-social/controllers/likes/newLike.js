import Publication from "../../models/publicationModel.js";

const newLike = async (req, res) => {
  try {
    const publicationId = req.params.publication_id;
    const userId = req.user.id;

    const publication = await Publication.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    if (publication.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Ya has dado like a esta publicación" });
    }

    // Agregar el like
    publication.likes.push(userId);
    await publication.save();

    // Obtener la publicación actualizada con los detalles del usuario que ha dado like
    const updatedPublication = await Publication.findById(publicationId).populate({
      path: "likes",
      select: "nick", // Incluye solo estos campos del usuario
    });

    res.status(200).json({
      message: "Like agregado con éxito",
      likesCount: updatedPublication.likes.length,
      likes: updatedPublication.likes,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "No se ha guardado el Like",
      error: error.message,
    });
  }
};

export default newLike;
