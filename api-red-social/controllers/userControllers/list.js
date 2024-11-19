import User from "../../models/userModel.js";
import { followUserIds as getFollowUserIds } from "../../services/followService.js";

const list = async (req, res) => {
  try {
    // Controlar en qué página estamos
    let page = parseInt(req.params.page) || 1;
    let itemsPerPage = 6;

    // Calcular el número de documentos a saltar
    const skip = (page - 1) * itemsPerPage;

    // Realizar la consulta excluyendo 'password', 'role', 'email', y '_id'
    const users = await User.find()
      .select("-password -role -__v -email")
      .skip(skip)
      .limit(itemsPerPage)
      .lean(); // Convierte el resultado a objetos JavaScript simples

    // Obtener el total de usuarios
    const total = await User.countDocuments();

    // Sacar Array de ids de los usuarios que sigue y los que me siguen
    let followData = await getFollowUserIds(req.user.id);

    // Devolver la respuesta
    return res.status(200).json({
      status: "success",
      page,
      itemsPerPage,
      total,
      pages: Math.ceil(total / itemsPerPage),
      users, // Enviamos los usuarios directamente, ya sin '_id'
      user_following: followData.following,
      user_follow_me: followData.followers,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la lista de usuarios",
      error: error.message,
    });
  }
};

export default list;
