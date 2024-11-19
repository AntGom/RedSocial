import jwt from "jsonwebtoken";


// Middleware autenticacion
const auth = (req, res, next) => {
    // Comprobar si me llega la cabecera de auth
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        });
    }

    // Limpiar el token
    const token = req.headers.authorization.replace(/['"]/g, "");

    // Decodificar el token
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Agregar el usuario al request
        req.user = payload;

        // Pasar a ejecución de la acción
        next();

    } catch (error) {
        return res.status(401).send({
            status: "error",
            message: "Token inválido",
            error: error.message
        });
    }
};

export default auth;
