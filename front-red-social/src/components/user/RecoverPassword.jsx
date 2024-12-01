import { useState } from "react";
import { Global } from "../../helpers/Global";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRecover = async (e) => {
    e.preventDefault();
    const request = await fetch(Global.url + "user/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();
    setMessage(data.message);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">Recuperar Contraseña</h1>
      <form onSubmit={handleRecover} className="mt-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Introduce tu email"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-2">
          Enviar
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default RecoverPassword;
