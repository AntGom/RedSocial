import UseForm from "../../../hooks/UseForm";
import { Global } from "../../../helpers/Global";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/UseAuth";
import LoginForm from "./LoginForm";
import LoginMessage from "./LoginMessage";
import BanNotificationModal from "./BanNotificationModal";

const Login = () => {
  const { form, changed } = UseForm({});
  const [saved, setSaved] = useState("not_sended");
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuth();
  const [showBanModal, setShowBanModal] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    const userToLogin = form;

    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    if (data.status === "success") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSaved("login");
      setAuth(data.user);

      setTimeout(() => {
        window.location.href = "/social";
      }, 300);
    } else if (data.status === "banned") {
      setSaved("banned");
      setShowBanModal(true);
    } else {
      setSaved("error");
    }
  };

  useEffect(() => {
    if (saved === "login" || saved === "error" || saved === "banned") {
      const timer = setTimeout(() => setSaved("not_sended"), 3000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const handleConfirmBan = () => {
    setShowBanModal(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({});
    setSaved("not_sended");

    // Redirigir al login después de aceptar
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

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
      <div className="text-center mt-4">
        <a
          href="/recover-password"
          className="text-blue-600 font-semibold hover:underline"
        >
          ¿Olvidaste la contraseña?
        </a>
      </div>
      <div className="text-center mt-2">
        <a
          href="/recover-request"
          className="text-blue-600 font-semibold hover:underline"
        >
          ¿Cuenta en suspensión? Recuperar ↻
        </a>
      </div>
      <LoginMessage saved={saved} setSaved={setSaved} />
      {showBanModal && (
        <BanNotificationModal onConfirm={handleConfirmBan} />
      )}{" "}
      {/* Mostrar el modal cuando está baneado */}
    </>
  );
};

export default Login;
