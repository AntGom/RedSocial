import User from "../../models/userModel.js";

const banUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({
        status: "error",
        message: "No tienes permisos para realizar esta acción",
      });
    }

    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    user.isBanned = true;

    await user.save();

    return res.status(200).send({
      status: "success",
      message: "Usuario baneado correctamente",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al banear el usuario",
      error: error.message,
    });
  }
};

export default banUser;
