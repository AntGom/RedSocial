import Publication from "../../models/publicationModel.js";
import { followUserIds } from "../../services/followService.js";
import User from "../../models/userModel.js";

const feed = async (req, res) => {
  try {
    let identity = req.user;
    let page = parseInt(req.params.page) || 1;
    let itemsPerPage = 5;

    //Mis intereses de usuario autenticado
    const user = await User.findById(identity.id).select("interests");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    //Usuarios seguidos
    let followUserId = await followUserIds(identity.id);

    //Usuarios con intereses comunes
    const usersWithCommonInterests = await User.find({
      interests: { $in: user.interests },
      _id: { $ne: identity.id }, //Excluir a mi mismo
    }).select("_id");

    //Crear [] de IDs de usuarios con intereses
    const commonInterestUserIds = usersWithCommonInterests.map((u) => u._id);

    //Combinar IDs de los seguidos+intereses
    const userIds = [...new Set([...followUserId.following, ...commonInterestUserIds])];

    if (userIds.length === 0) {
      return res.status(200).json({
        status: "success",
        message: `No sigues a nadie ni hay usuarios con intereses comunes, ${identity.name}.`,
        totalArticles: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        publications: [],
      });
    }

    //Consulta de publicaciones
    const query = { user: { $in: userIds } };

    const publications = await Publication.paginate(query, {
      page: page,
      limit: itemsPerPage,
      populate: [
        { path: "user", select: "_id name surname nick image" },
        { path: "comments.user", select: "_id name nick image" },
        { path: "likes.user", select: "_id name nick" },
      ],
      sort: { createdAt: -1 },
    });

    return res.status(200).json({
      status: "success",
      message: "Publicaciones obtenidas correctamente",
      totalArticles: publications.totalDocs,
      totalPages: publications.totalPages,
      currentPage: publications.page,
      hasNextPage: publications.hasNextPage,
      hasPrevPage: publications.hasPrevPage,
      publications: publications.docs,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el feed",
      error: error.message,
    });
  }
};

export default feed;
