// controllers/userController.js
import User from "../../models/userModel.js";
import Publication from "../../models/publicationModel.js";
import Follow from "../../models/followModel.js";

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    //Marcar el usuario como eliminado
    const user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    //Marcar publicaciones/comentarios/follows como eliminados
    await Promise.all([
      Publication.updateMany({ user: id }, { isDeleted: true }),
      Follow.updateMany({ $or: [{ user: id }, { followed: id }] }, { isDeleted: true }),
    ]);

    res.status(200).json({ message: "Usuario eliminado correctamente (soft delete)" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

export default deleteUser;