import UseForm from "../../hooks/UseForm";
import { Global } from "../../helpers/Global";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/UseAuth";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";



const Login = () => {
  const { form, changed } = UseForm({});
  const [saved, setSaved] = useState("not_sended");
  const [showPassword, setShowPassword] = useState(false);


  const { setAuth } = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();

    // Datos del formulario
    const userToLogin = form;

    // Petición al backend
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    // Persistir los datos en el navegador
    if (data.status === "success") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSaved("login");

      // Setear datos en auth
      setAuth(data.user);

      // Redirigir usuario a página de social
      setTimeout(() => {
        window.location.href = "/social";
      }, 300);
    } else {
      setSaved("error");
    }
  };

  useEffect(() => {
    if (saved === "login" || saved === "error") {
      const timer = setTimeout(() => setSaved("not_sended"), 3000);
      return () => clearTimeout(timer);
    }
  }, [saved]); 

  return (
    <>
      <header className="p-4 text-gray-900 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold">Identifícate</h1>
      </header>

      <div className="flex justify-center items-center h-2/5">
        <form
          className="bg-white border-2 border-gray-900 p-6 rounded-xl shadow-lg shadow-gray-600 w-2/5"
          onSubmit={loginUser}
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-900 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={changed}
              className="border-2 border-red-600 rounded w-full py-2 px-3"
            />
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
                  className="border-2 border-red-600 rounded w-full py-2 px-3"
                  onChange={changed}
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
          </div>

          <input
            type="submit"
            value="Entrar"
            className="text-gray-900 border-2 font-bold border-red-600 rounded py-2 px-4 hover:scale-110 transition-all duration-300 cursor-pointer"
          />
        </form>
      </div>

      {(saved === "login" || saved === "error") && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
          <div
            className={`relative p-4 rounded-lg shadow-md text-center text-white ${
              saved === "login" ? "bg-green-600" : "bg-red-600"
            }`}
            aria-live="polite"
          >
            <div className="flex">
              <p className="p-2">
                {saved === "login"
                  ? "¡¡Usuario identificado correctamente!!"
                  : "Email o contraseña incorrectos"}
              </p>
              <button
                onClick={() => setSaved("not_sended")}
                className="text-white font-bold text-xl"
                aria-label="Cerrar mensaje"
              >
                <XCircleIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
