import { useState } from "react";
import Toast from "../../../helpers/Toast";
import { Global } from "../../../helpers/Global";

const RecoverRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(Global.url + "user/request-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
      setShowToast(true);
    } catch (err) {
      setError(`Error: ${err.message || "No se pudo conectar al servidor."}`);
      setLoading(false);
      setShowToast(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="p-4 text-gray-900 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Recuperar Cuenta
        </h1>
      </header>

      <div className="border-2 border-gray-900 p-6 rounded-lg shadow-lg shadow-gray-600 w-2/5">
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-900 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu email"
              className="border-2 border-red-600 rounded w-full py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="text-gray-900 border-2 font-bold border-red-600 rounded py-2 px-4 hover:scale-110 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
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

export default RecoverRequest;
