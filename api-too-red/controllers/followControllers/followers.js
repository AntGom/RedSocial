import Follow from "../../models/followModel.js";
import { followUserIds } from "../../services/followService.js";

const followersList = async (req, res) => {
  try {
    // Sacar id del usuario logueado
    let userId = req.user.id;

    // Comprobar si me llega el id por params en la url
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la página, sino, la 1
    let page = parseInt(req.params.page) || 1;

    // Usuarios por página
    const itemsPerPage = 5;

    // Opciones de paginación
    const options = {
      page: page,
      limit: itemsPerPage,
      populate: [
        { path: "user", select: "-password -role -__v" },
        { path: "followed", select: "-password -role -__v" },
      ],
      sort: { created_at: -1 },
    };

    // Find a follow, popular datos de user y paginar con mongoose paginate
    const result = await Follow.paginate({ followed: userId }, options);

    // Sacar array de ids que me siguen y los que sigo yo
    let followUserIdsResult = await followUserIds(req.user.id);

    return res.status(200).send({
      status: "success",
      message: "Lista de usuarios que me siguen",
      total: result.totalDocs,
      pages: result.totalPages,
      follows: result.docs,

      user_following: followUserIdsResult.following,
      user_follow_me: followUserIdsResult.followers,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener la lista de seguidores",
      error: error.message,
    });
  }
};

export default followersList;
