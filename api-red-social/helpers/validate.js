import validator from "validator";

const validate = (params) => {

  try {
    const name =
      typeof params.name === "string" &&
      !validator.isEmpty(params.name) &&
      validator.isLength(params.name, { min: 3 }) &&
      validator.isAlpha(params.name, "es-ES");

    const surname =
      typeof params.surname === "string" &&
      !validator.isEmpty(params.surname) &&
      validator.isLength(params.surname, { min: 3 }) &&
      validator.isAlpha(params.surname, "es-ES");

    const nick =
      typeof params.nick === "string" &&
      !validator.isEmpty(params.nick) &&
      validator.isLength(params.nick, { min: 3 });

    const email =
      typeof params.email === "string" &&
      !validator.isEmpty(params.email) &&
      validator.isEmail(params.email);

    const password =
      typeof params.password === "string" &&
      !validator.isEmpty(params.password);

    const bio =
      typeof params.bio === "string"
        ? validator.isLength(params.bio, { max: 250 })
        : true; // Permite bio vacío o undefined

    // Si alguna validación falla, lanza un error
    if (!name || !surname || !nick || !email || !password || !bio) {
      throw new Error("Datos no validados");
    }

    console.log("Datos validados correctamente");
    return { success: true, message: "Datos validados correctamente" };
    
  } catch (error) {
    console.error("Error de validación:", error.message);
    return { success: false, errors: [error.message] };
  }
};

export default validate;
