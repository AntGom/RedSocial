import { useState } from "react";
import { Global } from "../../helpers/Global";
import ToastManager from "../user/Profile/ProfileActions/ToastManager";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showToast, setShowToast] = useState(false);

  const handleRecover = async (e) => {
    e.preventDefault();
    setLoading(true);
    const request = await fetch(Global.url + "user/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLoading(false);
    const data = await request.json();
    setToast({
      message: data.message,
      type: data.status === "success" ? "success" : "error",
    });
    setShowToast(true);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="p-4 text-gray-900 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Recuperar Contraseña
        </h1>
      </header>

      <section className="border-2 border-gray-900 p-6 rounded-lg shadow-lg shadow-gray-600 w-11/12 md:w-4/5 lg:w-2/5">
        <form onSubmit={handleRecover} className="mt-6">
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
      </section>

      <ToastManager
        showToast={showToast}
        toast={toast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default RecoverPassword;
