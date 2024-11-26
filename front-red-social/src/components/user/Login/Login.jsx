import UseForm from "../../../hooks/UseForm";
import { Global } from "../../../helpers/Global";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/UseAuth";
import LoginForm from "./LoginForm";
import LoginMessage from "./LoginMessage";

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
        <LoginForm
          form={form}
          changed={changed}
          loginUser={loginUser}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>

      <LoginMessage saved={saved} setSaved={setSaved} />
    </>
  );
};

export default Login;
