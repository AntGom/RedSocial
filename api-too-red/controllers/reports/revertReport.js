import Publication from "../../models/publicationModel.js";
import User from "../../models/userModel.js";

const revertReport = async (req, res) => {
  const { publicationId, reportId } = req.params;
  const userId = req.user.id;

  try {
    //Verificar rol
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para revertir este reporte",
      });
    }

    //Buscar publicación
    const publication = await Publication.findById(publicationId);

    if (!publication) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada",
      });
    }

    //Buscar reporte
    const reportIndex = publication.reports.findIndex(
      (report) => report._id.toString() === reportId
    );

    if (reportIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Reporte no encontrado",
      });
    }

    //Eliminar reporte
    publication.reports.splice(reportIndex, 1);
    publication.reportCount = publication.reports.length;

    await publication.save();

    return res.status(200).json({
      status: "success",
      message: "Reporte revertido con éxito",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al revertir el reporte",
      error: error.message,
    });
  }
};

export default revertReport;
