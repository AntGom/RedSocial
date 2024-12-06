import User from "../../models/userModel.js";

const unbanUser = async (req, res) => {
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
  
      user.isBanned = false;
      await user.save();
  
      return res.status(200).send({
        status: "success",
        message: "Usuario desbaneado correctamente",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al desbanear el usuario",
        error: error.message,
      });
    }
  };
  
  export default unbanUser;
  