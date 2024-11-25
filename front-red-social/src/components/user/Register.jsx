import { useState } from "react";
import { Global } from "../../helpers/Global";
import UseForm from "../../hooks/UseForm";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import validateForm from "../../helpers/validateForm.js"; // Importar la validación
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const Register = () => {
  const { form, changed } = UseForm({});
  const [saved, setSaved] = useState("not_sended");
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="mb-2">
            <label htmlFor="name" className="block text-gray-900 font-semibold">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              onChange={changed}
              value={form.name}
              className="border-2 border-red-600 rounded w-full py-2 px-3"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div className="mb-2">
            <label
              htmlFor="surname"
              className="block text-gray-900 font-semibold"
            >
              Apellidos
            </label>
            <input
              type="text"
              name="surname"
              onChange={changed}
              value={form.surname}
              className="border-2 border-red-600 rounded w-full py-2 px-3"
            />
            {errors.surname && <p className="text-red-500">{errors.surname}</p>}
          </div>

          <div className="mb-2">
            <label htmlFor="nick" className="block text-gray-900 font-semibold">
              Alias
            </label>
            <input
              type="text"
              name="nick"
              onChange={changed}
              value={form.nick}
              className="border-2 border-red-600 rounded w-full py-2 px-3"
            />
            {errors.nick && <p className="text-red-500">{errors.nick}</p>}
          </div>

          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-gray-900 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={changed}
              value={form.email}
              className="border-2 border-red-600 rounded w-full py-2 px-3"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={changed}
                value={form.password}
                className="border-2 border-red-600 rounded w-full py-2 px-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-6 h-6 text-gray-700" />
                ) : (
                  <EyeIcon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>

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
