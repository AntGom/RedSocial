import User from "../../models/userModel.js";
import Publication from "../../models/publicationModel.js";
import Follow from "../../models/followModel.js";
import mongoose from "mongoose";

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const loggedUserId = req.user.id;

  //Usuario logueado=quiere eliminar perfil
  if (id !== loggedUserId) {
    return res.status(403).json({ message: "No tienes permiso para eliminar otro perfil" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de usuario no válido" });
  }

  try {
    //Usuario eliminado lógicamente y fecha
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    //Borrar publicaciones, comentarios y follows
    await Promise.all([
      Publication.updateMany({ user: id }, { isDeleted: true, deletedAt: new Date() }),
      Follow.updateMany({ $or: [{ user: id }, { followed: id }] }, { isDeleted: true, deletedAt: new Date() }),
    ]);

    res.status(200).json({ message: "Usuario eliminado correctamente (soft delete)" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

export default deleteUser;
