import { useState } from "react";
import { useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    const request = await fetch(Global.url + "user/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();
    setMessage(data.message);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">Establecer Nueva Contraseña</h1>
      <form onSubmit={handleReset} className="mt-4">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Introduce tu nueva contraseña"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-2">
          Cambiar Contraseña
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ResetPassword;
