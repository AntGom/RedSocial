import Publication from '../../models/publicationModel.js';

const remove = async (req, res) => {
    try {
        // Buscar la publicación que coincida con el ID proporcionado y el usuario actual
        // Solo el creador de la publicación puede eliminarla
        const publication = await Publication.findOne({
            user: req.user.id,  // ID del usuario autenticado
            _id: req.params.id  // ID de la publicación a eliminar
        });

        // Si no se encuentra la publicación, significa que no existe/usuario sin permiso
        if (!publication) {
            return res.status(404).json({
                status: "error",
                message: "Publicación no encontrada o no tienes permiso para eliminarla",

            });
        }

        // Si se encuentra la publicación, eliminar
        await publication.deleteOne();

        return res.status(200).json({
            status: "success",
            message: "Publicación eliminada correctamente",
            publication: req.params.id,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar la publicación",
            error: error.message,
        });
    }
};

export default remove;