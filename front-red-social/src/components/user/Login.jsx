import UseForm from "../../hooks/useForm";
import { Global } from "../../helpers/Global";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const Login = () => {

  const { form, changed } = UseForm({});
  const [saved, setSaved] = useState("not_sended");

  const {setAuth} = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();

    //Datos del formulario
    const userToLogin = form;

    //Peticion al backend
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    //Persistir los datos en el navegador
    if(data.status === "success"){

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSaved("login");

      //Setear datos en auth
      setAuth(data.user);
      
      //Redirigir al usuario a la página de social
      setTimeout(() => {
        window.location.href = "/social";
      }, 300);

    }else{
      setSaved("error");
    }
  };

  return (
    <>
      <header className=" p-4 text-cyan-800 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold">Login</h1>
      </header>

      <div className="flex justify-center items-center h-2/5">
        <form className="bg-cyan-800 p-6 rounded-3xl shadow-lg shadow-blue-600 w-2/5" onSubmit={loginUser}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">Email</label>
            <input type="email" id="email" name="email" onChange={changed} className="border rounded w-full py-2 px-3" />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-white">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={changed}
              className="border rounded w-full py-2 px-3"
            />
          </div>

          <input type="submit" value="Identifícate" className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700" />
        </form>
      </div>

      {saved === "login" ? (
        <strong className="text-green-500 text-center" aria-live="polite">
          ¡¡Usuario identificado correctamente!!
        </strong>
      ) : (
        ""
      )}

      {saved === "error" ? (
        <strong className="text-red-500 text-center" aria-live="polite">
          Error al identificar el usuario
        </strong>
      ) : (
        ""
      )}
    </>
  );
};

export default Login;
