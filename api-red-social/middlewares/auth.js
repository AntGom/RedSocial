import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "La petición no tiene la cabecera de autenticación",
    });
  }

  const token = req.headers.authorization.replace(/['"]/g, "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.id || !payload.role) {
      return res.status(401).send({
        status: "error",
        message: "El token no contiene información válida",
      });
    }

    req.user = { id: payload.id, role: payload.role };
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
