import { useState } from "react";
import { Global } from "../../../helpers/Global";
import UseForm from "../../../hooks/UseForm";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";
import validateForm from "../../../helpers/validateForm.js"; // Importar la validación

const Register = () => {
  const { form, changed } = UseForm({});
  const [saved, setSaved] = useState("not_sended");
  const [errors, setErrors] = useState({}); // Para manejar los errores de validación
  const navigate = useNavigate(); // Inicializamos useNavigate

  // Función para manejar el envío del formulario
  const saveUser = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form); // Realiza la validación
    setErrors(validationErrors); // Actualiza los errores en el estado

    // Si hay errores, no se envía el formulario
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    let newUser = form;

    // Realizar la solicitud
    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    // Manejar la respuesta del servidor
    if (data.status === "success") {
      setSaved("saved"); // Cambiar estado a 'saved' para mostrar mensaje éxito
      setTimeout(() => {
        navigate("/login"); // Redirigir a login tras 2 segundos
      }, 2000); // Espera 2 segundos redirigir
    } else {
      setSaved("error"); // Cambiar estado a 'error' si error
      setErrors({ general: data.message }); // Mostrar el mensaje de error general
    }
  };

  return (
    <div className="mb-8">
      <header className="p-4 text-gray-900 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold">Registro</h1>
      </header>

      <div className="flex flex-col gap-2 justify-center items-center h-2/5">
        <div>
          {saved === "saved" && (
            <strong className="text-green-500">
              ¡¡Usuario registrado correctamente!!
            </strong>
          )}

          {saved === "error" && errors.general && (
            <strong className="text-red-500">
              {errors.general} {/* Mostrar el error general enviado desde el backend */}
            </strong>
          )}
        </div>

        <form
          className="bg-white border-2 border-gray-900 p-6 rounded-xl shadow-lg shadow-gray-600 w-2/5"
          onSubmit={saveUser}
        >
          <FormInput
            label="Nombre"
            name="name"
            value={form.name}
            onChange={changed}
            error={errors.name}
          />

          <FormInput
            label="Apellidos"
            name="surname"
            value={form.surname}
            onChange={changed}
            error={errors.surname}
          />

          <FormInput
            label="Alias"
            name="nick"
            value={form.nick}
            onChange={changed}
            error={errors.nick}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={changed}
            error={errors.email}
          />

          <PasswordInput
            value={form.password}
            onChange={changed}
            error={errors.password}
          />

          <input
            type="submit"
            value="Regístrate"
            className="text-gray-900 border-2 font-bold border-red-600 rounded py-2 px-4 hover:scale-110 transition-all duration-300 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
