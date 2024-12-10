import Publication from "../../models/publicationModel.js";

const reportPublication = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;

  try {
    //Buscar publicación
    const publication = await Publication.findById(id);

    if (!publication) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada",
      });
    }

    //Comprobar si user reportó publicación antes
    const alreadyReported = publication.reports.some(
      (report) => report.user.toString() === userId
    );

    if (alreadyReported) {
      return res.status(400).json({
        status: "error",
        message: "Ya has reportado esta publicación",
      });
    }

    // Añadir reporte
    publication.reports.push({ user: userId, reason });
    publication.reportCount = publication.reports.length;

    await publication.save();

    return res.status(200).json({
      status: "success",
      message: "Reporte enviado con éxito",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al reportar la publicación",
      error: error.message,
    });
  }
};

export default reportPublication;
