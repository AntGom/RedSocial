/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../../../helpers/Toast";
import { Global } from "../../../helpers/Global";

const RecoverAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
  
    if (token) {
      recoverAccount(token);
    } else {
      setError("Token inválido o no encontrado en la URL.");
      setShowToast(true);
    }
  }, [location]);
  

  const recoverAccount = async (token) => {
    try {
      const response = await fetch(Global.url + "user/recover-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setShowToast(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message);
        setShowToast(true);
      }
    } catch (err) {
      setError(`Error: ${err.message || "No se pudo conectar al servidor."}`);
      setShowToast(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="p-4 text-gray-900 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Recuperación de Cuenta
        </h1>
      </header>

      <div className="border-2 border-gray-900 p-6 rounded-lg shadow-lg shadow-gray-600 w-2/5">
        {showToast && (
          <Toast
            message={message || error}
            type={message ? "success" : "error"}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RecoverAccount;
