import Publication from "../../models/publicationModel.js";
import { followUserIds } from "../../services/followService.js";

const feed = async (req, res) => {
  try {
    let identity = req.user;
    let page = parseInt(req.params.page) || 1;
    let itemsPerPage = 5;

    let query = {};

    if (identity.role === "admin" || identity.role === "master") {
      // Mostrar todas las publicaciones para admin o master
      query = {};
    } else {
      // Mostrar solo publicaciones de usuarios seguidos
      let followUserId = await followUserIds(identity.id);
      if (followUserId.following.length === 0) {
        return res.status(200).json({
          status: "success",
          message: `No sigues a nadie, por lo tanto no hay publicaciones en tu feed, ${identity.name}.`,
          totalArticles: 0,
          totalPages: 0,
          currentPage: 1,
          hasNextPage: false,
          hasPrevPage: false,
          publications: []
        });
      }
      query = { user: { $in: followUserId.following } };
    }

    const publications = await Publication.paginate(query, {
      page: page,
      limit: itemsPerPage,
      populate: [
        { path: "user", select: "_id name surname nick image" },
        { path: "comments.user", select: "_id name nick image" },
        { path: "likes.user", select: "_id name nick" }
      ],
      sort: { createdAt: -1 }
    });

    return res.status(200).json({
      status: "success",
      message: "Publicaciones obtenidas correctamente",
      totalArticles: publications.totalDocs,
      totalPages: publications.totalPages,
      currentPage: publications.page,
      hasNextPage: publications.hasNextPage,
      hasPrevPage: publications.hasPrevPage,
      publications: publications.docs
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el feed",
      error: error.message
    });
  }
};

export default feed;
