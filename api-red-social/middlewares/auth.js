import jwt from "jsonwebtoken";
import User from "../models/userModel.js";  // Asegúrate de importar el modelo de usuario

const auth = async (req, res, next) => {
  // Verificar si se proporciona la cabecera de autenticación
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "La petición no tiene la cabecera de autenticación",
    });
  }

  const token = req.headers.authorization.replace(/['"]/g, "");

  try {
    // Verificar el token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.id || !payload.role) {
      return res.status(401).send({
        status: "error",
        message: "El token no contiene información válida",
      });
    }

    // Guardar la información del usuario decodificado en la request
    req.user = { id: payload.id, role: payload.role };

    // Verificar si el usuario está baneado
    const user = await User.findById(req.user.id);

    if (user.isBanned) {
      return res.status(403).send({
        status: "error",
        message: "Tu cuenta está baneada",
      });
    }

    // Continuar con la siguiente función del middleware o controlador
    next();
  } catch (error) {
    return res.status(401).send({
      status: "error",
      message: "Token inválido",
      error: error.message,
    });
  }
};

export default auth;
