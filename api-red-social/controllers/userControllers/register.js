import User from "../../models/userModel.js";
import bcrypt from "bcrypt";
import validate from "../../helpers/validate.js";

//Registro de Usuarios
const register = async (req, res) => {
  //Recoger los datos de la petición
  let params = req.body;

  //Comprobar que llegan bien (+ validacion)
  if (
    !params.name ||
    !params.surname ||
    !params.nick ||
    !params.email ||
    !params.password
  ) {
    return res.status(400).json({
      status: "error",
      message: "Todos los campos son obligatorios",
    });
  }

  //Validacion avanzada
  validate(params);


  try {
    //Control usuarios duplicados
    const existingUser = await User.findOne({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "El usuario ya existe",
      });
    }

    //Crear objeto de usuario
    let user_to_save = new User(params);

    //Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    user_to_save.password = await bcrypt.hash(params.password, salt);

    //Guardar usuario
    const savedUser = await user_to_save.save();

    //Devolver el resultado
    return res.status(200).json({
      status: "success",
      message: "Usuario registrado correctamente",
      user: savedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el registro de usuario",
      error: error.message,
    });
  }
};

export default register;
